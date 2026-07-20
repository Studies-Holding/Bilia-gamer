cmake_minimum_required(VERSION 3.22)
project(afg_studio_gdextension LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# godot-cpp : bindings officiels GDExtension (MIT), recupere via `git submodule update --init`.
# cf. https://github.com/godotengine/godot-cpp
if(NOT EXISTS "${CMAKE_SOURCE_DIR}/third_party/godot-cpp/CMakeLists.txt")
  message(FATAL_ERROR
    "third_party/godot-cpp est vide. Lancer : git submodule update --init --recursive third_party/godot-cpp")
endif()
add_subdirectory(third_party/godot-cpp)

# Dependances header-only (vendored via vcpkg, cf. vcpkg.json, ou recuperees manuellement).
find_package(httplib CONFIG QUIET)
find_package(nlohmann_json CONFIG QUIET)

file(GLOB_RECURSE AFG_STUDIO_SOURCES CONFIGURE_DEPENDS
  "${CMAKE_SOURCE_DIR}/src/*.cpp"
)

add_library(afg_studio SHARED ${AFG_STUDIO_SOURCES})

target_include_directories(afg_studio PRIVATE
  "${CMAKE_SOURCE_DIR}/src"
)

target_link_libraries(afg_studio PRIVATE godot-cpp)
if(httplib_FOUND)
  target_link_libraries(afg_studio PRIVATE httplib::httplib)
endif()
if(nlohmann_json_FOUND)
  target_link_libraries(afg_studio PRIVATE nlohmann_json::nlohmann_json)
endif()

set_target_properties(afg_studio PROPERTIES
  OUTPUT_NAME "afg_studio"
  ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/project/addon/afg_studio/bin"
  LIBRARY_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/project/addon/afg_studio/bin"
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/project/addon/afg_studio/bin"
)

# Tests C++ (Catch2, logique pure uniquement — pas de dependance a l'editeur Godot).
option(AFG_STUDIO_BUILD_TESTS "Build des tests unitaires C++ (Catch2)" ON)
if(AFG_STUDIO_BUILD_TESTS)
  enable_testing()
  find_package(Catch2 3 CONFIG QUIET)
  if(Catch2_FOUND)
    add_executable(afg_studio_tests
      tests/rules_resource.test.cpp
      src/rules/afg_rules_engine_bridge.cpp
    )
    target_include_directories(afg_studio_tests PRIVATE "${CMAKE_SOURCE_DIR}/src")
    target_link_libraries(afg_studio_tests PRIVATE Catch2::Catch2WithMain)
    if(nlohmann_json_FOUND)
      target_link_libraries(afg_studio_tests PRIVATE nlohmann_json::nlohmann_json)
    endif()
    add_test(NAME afg_studio_unit_tests COMMAND afg_studio_tests)
  else()
    message(STATUS "Catch2 non trouve — tests C++ desactives (installer via vcpkg pour les activer).")
  endif()
endif()

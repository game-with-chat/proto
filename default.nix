{pkgs ? import <nixpkgs> {}}:
pkgs.buildNpmPackage {
  name = "gwc";
  src = ./.;
  npmDepsHash = "sha256-hWVqJwEF4X0yk4CPrG5R/iFWV4Lz/f+3sy6CJ8mh5Lk=";
  dontNpmBuild = true;
}
{pkgs ? import <nixpkgs> {}}:
pkgs.buildNpmPackage {
  name = "gwc";
  src = ./.;
  npmDepsHash = builtins.readFile ./package-lock.sha256;
  dontNpmBuild = true;
}
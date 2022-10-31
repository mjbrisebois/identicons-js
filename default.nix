{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "";

  buildInputs = [
  ];

  nativeBuildInputs = [
    pkgs.nodejs-18_x
  ];
}

{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

		tumblepkgs = {
			url = "git+https://git.disroot.org/tumble/tumblepkgs";
			inputs.nixpkgs.follows = "nixpkgs";
		};
  };
  outputs = {self,nixpkgs,tumblepkgs}:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      overlays = [ tumblepkgs.overlays.default ]; 
    };
  in 
  {
    packages.${system} = rec {
      gwc = pkgs.callPackage ./default.nix {};
      dev = pkgs.writeShellApplication {
        name = "show-nixos-org";

        runtimeInputs = with pkgs; [ npm gwc ];

        text = ''
          npm run dev
        '';
      };
      npm = pkgs.npm;
      default = gwc;

    };

    defaultPackage.${system} = self.packages.${system}.gwc;
  };
}
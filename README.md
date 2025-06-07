My custom dot files(Updated)
============

![WhatsApp Image 2025-06-07 at 11 29 26](https://github.com/user-attachments/assets/5a1c092c-6165-4796-83eb-3ffe6bf7429e)

Be sure to have Iosevka Nerd Font or any other Nerd Font for symbols.

(STEP 1)
If you're on Arch, you can simple run this and it will install all the stuff:

`yay -S starship fastfetch grim slurp fish aylur-gtk-shell hyprland ttf-fantasquesansm-nerd swww papirus-icon-theme kitty fuzzel git base-devel`

(OPTIONAL) maybe there are some other dependencies like mpris, bluetooth, so if anything goes wrong, run this command too:
`sudo pacman -Syu upower networkmanager pipewire-pulse libdbusmenu-gtk3 ttf-hanazono gvfs xdg-user-dirs`

(STEP 2)
Clone the repo with:
`git clone https://github.com/larkjkj/dotfiles/`
Make a .config folder(probally you have)
`mkdir ~/.config`
Move the content from dotfiles to .config and delete the dotfiles folder
`mv ~/dotfiles ~/.config/`

You can test it, by running hyprland
enjoy :)

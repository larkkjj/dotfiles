set nocompatible
set noequalalways 
set relativenumber
set number
set autoindent
set termguicolors
set signcolumn=yes:1
set laststatus=3
set cmdheight=0
set makeprg=make

highlight WinSeparator guifg=bg 
highlight NvimTreeWinSeparator guifg=bg 
highlight NvimTreeWinSeparator guibg=bg 
highlight WinSeparator guibg=bg 

let g:mkdp_browser = 'chromium'

filetype plugin indent on
syntax enable
call plug#begin()
Plug 'rose-pine/neovim'
Plug 'elkowar/yuck.vim'
Plug 'loctvl842/monokai-pro.nvim'
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && npx --yes yarn install' }
Plug 'MeanderingProgrammer/render-markdown.nvim'
Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/cmp-buffer'
Plug 'hrsh7th/cmp-path'
Plug 'hrsh7th/cmp-cmdline'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'hrsh7th/nvim-cmp'
Plug 'nvim-tree/nvim-tree.lua'
Plug 'catppuccin/nvim'
Plug 'aktersnurra/no-clown-fiesta.nvim'
Plug 'mistricky/codesnap.nvim', { 'tag': '2.0.0-beta.17' }
Plug 'marko-cerovac/material.nvim'
Plug 'lewis6991/gitsigns.nvim'
Plug 'skywind3000/vim-keysound'
Plug 'nvim-lualine/lualine.nvim'
Plug 'DaikyXendo/nvim-material-icon'
Plug 'nvim-tree/nvim-web-devicons'
Plug 'vyfor/cord.nvim'
Plug 'MunifTanjim/nui.nvim'
Plug 'nvim-lua/plenary.nvim'
Plug 'nvim-mini/mini.nvim'
Plug 'hrsh7th/nvim-cmp'
Plug 'aclements/latexrun'
Plug 'JafarDakhan/vim-gml'
Plug 'lervag/vimtex'
Plug 'sphamba/smear-cursor.nvim'
Plug 'EdenEast/nightfox.nvim'
Plug 'akinsho/bufferline.nvim'
call plug#end()

let g:keysound_enable = 1
let g:keysound_theme = "typewriter"

nnoremap <C-space> :NvimTreeToggle<CR>
nnoremap <C-A> <C-W>w
nnoremap <C-O> :bd<CR>

nnoremap <C-left> :BufferLineCyclePrev<CR>
nnoremap <C-right> :BufferLineCycleNext<CR>

lua << EOF
local cmp = require('cmp')
vim.g.nvim_tree_disable_default_keybindings = 1
vim.g.material_style = 'darker'
vim.lsp.config['typescript'] = {
	cmd = { 'typescript-language-server', '--stdio' },
	filetypes = { 'typescriptreact' }
}
vim.lsp.enable('typescript')

require('rose-pine').setup({
	dark_variant = "main",
	extend_background_behind_borders = true,

	enable = {
		terminal = true,
		legacy_highlights = false,
		migrations = true,
	},

	styles = {
		bold = true,
		italic = true,
	}
})

require('render-markdown').setup({
	completions = {
	    lsp = {
		    enabled = true,
	    }
	},
	latex = {
		enabled = true,
		render_modes = true,
		converter = { 'uftex', 'latex2text' },
		highlight = 'RenderMarkdownMath',
	}
})


--[[require('catppuccin').setup({
	flavour = "mocha",
	background = {
		dark = "mocha",	
	},
	transparent_background = true,
	term_colors = false,
	styles = {
		comments = { "italic" },
		variables = { "italic" },
		types = { "italic" }
	}
})]]

require('material').setup({
	contrast = {
		terminal = true,
		sidebars = true,
		floating_windows = true,
		cursor_line = true,
		non_current_windows = false,
	},
	styles = {
		types = {
			italic = true,
		},
		keywords = {
			italic = true
		},
		comments = {
			italic = true
		}
	},
	lualine_style = "stealth",
})

require('gitsigns').setup()

require('lualine').setup({
	theme = 'material',
	global_status = true,
})

require('codesnap').setup({
	show_workspace = true,
	highlight_color = "#00000000",

	snapshot_config = {
		themes_folders = {
			"~/.config/codesnap/themes",
		},
		background = "#00000000",
		margin = {
			x = 10,
			y = 10,
		},
		watermark = {
			content = ""
		},
		code_config = {
			font_family = "GeistMono Nerd Font"
		}
	},
})

require("cord").setup({
	show_line_number = true,
	code_theme = "Material Theme Darker",
	assets = {
		['Cord.override'] = "https://pbs.twimg.com/media/E0aJbm2XoAUuvxF?format=jpg&name=large",
	},
	idle = {
		enabled = false,
	}
})

require('nvim-web-devicons').set_icon {
	c = {
		icon = "",
		color = "#7287fd",
		name = "elf-custom"
	},
	elf = {
		icon = "󱅷",
		color = "#7287fd",
		name = "elf-custom"
	}
} 

require('nvim-web-devicons').setup({
	default = false,
	blend = true,
})

require("nvim-tree").setup({
	disable_netrw = true,
	respect_buf_cwd = true,
	prefer_startup_root = false,
	filters = {
		git_ignored = false,
	},
	view = {
		float = {
			enable = false,
			quit_on_focus_loss = false,
			open_win_config = {
				width = 23,
			},
		},
		cursorline = true,
		centralize_selection = true,
		width = 23,
		signcolumn = "yes",
	},

	renderer = {
		add_trailing = true,
		highlight_modified = "all",
		icons = {
			show = {
				file = true,
				folder = true,
				folder_arrow = false,
			},
			glyphs = {
				folder = {
					default = "󰉋",
					open = "",
					empty = "󰉖",
					empty_open = "",
				},
				git = {
					unstaged = "󱎺",
					untracked = "󰅾",
					renamed = "",
					deleted = "",
					ignored = "",
					staged = "󰴄",
				}
			}
		},
		add_trailing = true,
		root_folder_label = false,
		indent_width = 2,
		indent_markers = {
			enable = true,
		},
	
		icons = {
			git_placement = "before",
			padding = {
				icon = " ",
				folder_arrow = " "
			}
		},
	},
})

--[[require('neo-tree').setup({
	filesystem = {
		use_libuv_file_watcher = false,
	},
	window = {
		position = 'left',
		width = 24,
auto_expand_width = true,
	},
	icons = {
		separator = {
			left = '',
			right = ''
		},
		separator_at_end = false,
	},
})]]

require('smear_cursor').setup({
	stiffness = 0.6,
	trailing_stiffness = 0.3,
	distance_stop_animating = 0.9,
	matrix_pixel_threshold = 0,
	opts = {
		cursor_color = "none",
	},
})

require('cmp').setup({
	snippet = {
	      -- REQUIRED - you must specify a snippet engine
	      expand = function(args)
		vim.fn["vsnip#anonymous"](args.body) -- For `vsnip` users.
		-- require('luasnip').lsp_expand(args.body) -- For `luasnip` users.
		-- require('snippy').expand_snippet(args.body) -- For `snippy` users.
		-- vim.fn["UltiSnips#Anon"](args.body) -- For `ultisnips` users.
		-- vim.snippet.expand(args.body) -- For native neovim snippets (Neovim v0.10+)

		-- For `mini.snippets` users:
		-- local insert = MiniSnippets.config.expand.insert or MiniSnippets.default_insert
		-- insert({ body = args.body }) -- Insert at cursor
		-- cmp.resubscribe({ "TextChangedI", "TextChangedP" })
		-- require("cmp.config").set_onetime({ sources = {} })
	      end,
	    },
	window = {
	      -- completion = cmp.config.window.bordered(),
	  -- documentation = cmp.config.window.bordered(),
	    },
	    mapping = cmp.mapping.preset.insert({
	      ['<C-b>'] = cmp.mapping.scroll_docs(-4),
	      ['<C-f>'] = cmp.mapping.scroll_docs(4),
	      ['<C-Space>'] = cmp.mapping.complete(),
	      ['<C-e>'] = cmp.mapping.abort(),
	      ['<CR>'] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
	    }),
	    sources = cmp.config.sources({
	      { name = 'nvim_lsp' },
	      { name = 'vsnip' }, -- For vsnip users.
	      -- { name = 'luasnip' }, -- For luasnip users.
	      -- { name = 'ultisnips' }, -- For ultisnips users.
	      -- { name = 'snippy' }, -- For snippy users.
	    }, {
	      { name = 'buffer' },
	    })
	})

vim.opt.fillchars:append("vert: ")

require('nightfox').setup({
	options = {
		transparent = true,
		terminal_colors = true,
		styles = {
			types = "italic",
			keywords = "italic",
			comments = "italic"
		},
	}
})

require('monokai-pro').setup({
	transparent_background = true,
	inc_search = "underline",
	terminal_colors = true,
	background_clear = {
		"nvim-tree",
		"nvimtree",
		"toggleterm",
		"telescope",
		"float-win",
		"neo-tree",
		"neotree",
	},
	styles = {
		types = {
			italic = true,
		},
		keywords = {
			italic = true
		},
		comments = {
			italic = true
		}
	},

	filter = spectrum,
})

require("bufferline").setup({
	highlights = {
		fill = {
			fg = 'none',
			bg = 'none',
		}
	},
	options = {
		themable = true,
		indicator = {
			icon = '',
			style = 'underline',
		},
		tab_size = 15,
		separator_style = 'thick',
		hover = {
			enabled = true,
			delay = 200,
			reveal = {'close'}
		},
		show_buffer_icons = true,
		show_buffer_close_icons = true,
		show_tab_indicators = true,
		groups = {
			items = {
				highlight = {
					underline = true,
				}
			}
		},

	},
})

vim.cmd("colorscheme rose-pine")
EOF


filetype plugin indent on
set relativenumber
set number
set autoindent
syntax enable

call plug#begin()
Plug 'nvim-neo-tree/neo-tree.nvim'
Plug 'MunifTanjim/nui.nvim'
Plug 'nvim-lua/plenary.nvim'
Plug 'nvim-mini/mini.nvim'
Plug 'hrsh7th/nvim-cmp'
Plug 'aclements/latexrun'
Plug 'JafarDakhan/vim-gml'
Plug 'jiangmiao/auto-pairs'
Plug 'lervag/vimtex'
Plug 'sphamba/smear-cursor.nvim'
Plug 'EdenEast/nightfox.nvim'
call plug#end()

let g:vimtex_latexmk_enabled = 0
let g:vimtex_compiler_method = 'latexmk'
let g:vimtex_view_method = 'zathura'
let g:vimtex_view_general_options = '--unique file:@pdf\#src:@line@tex'

lua << EOF
local cmp = require('cmp')

require('neo-tree').setup({
	sources = {
		"filesystem",
	},
	filesystem = {
		follow_current_file = {
			enabled = yes
			}
	}
})

require('nightfox').setup({
	terminal_colors = true,
})

vim.cmd("colorscheme carbonfox")

require('smear_cursor').setup()

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
EOF


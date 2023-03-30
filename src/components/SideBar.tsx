import * as React from 'react'
import { type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DataUsageIcon from '@mui/icons-material/DataUsage'
import HomeIcon from '@mui/icons-material/Home'
import CachedIcon from '@mui/icons-material/Cached'
import { type SvgIconComponent } from '@mui/icons-material'

const drawerWidth = 240
type SideBarProps = {
	children: React.ReactNode
}

type SideBarMenu = {
	name: string
	url: string
	icon: SvgIconComponent
}

type SideBarMenuInterface = Record<string, SideBarMenu>

const SideBarItems: SideBarMenuInterface[] = [
	{
		home: {
			name: 'Home',
			url: '/dashboard/home',
			icon: HomeIcon
		}
	},
	{
		index_usage: {
			name: 'Index Usage',
			url: '/dashboard/index_usage',
			icon: DataUsageIcon
		}
	},
	{
		index_cache_hit: {
			name: 'Index Cache Hit',
			url: '/dashboard/index_cache_hit',
			icon: CachedIcon
		}
	}
]

function SideBarItemList (): JSX.Element {
	return (
		<List>
			{SideBarItems.map((item: SideBarMenuInterface, index: number) => {
				// Get the dynamic key for the current item
				const key = Object.keys(item)[0] // home
				// Get the SideBarMenu object for the current item
				const menu = item[key]

				return (
					<ListItem key={key} disablePadding>
						<ListItemButton href={menu.url}>
							<ListItemIcon>
								<menu.icon htmlColor='#ffffff' />
							</ListItemIcon>
							<ListItemText primary={menu.name} />
						</ListItemButton>
					</ListItem>
				)
			})}
		</List>
	)
}

export default function PermanentDrawerLeft ({ children }: SideBarProps): JSX.Element {
	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
			>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						bgcolor: '#0A1828',
						color: '#8B959F'
					}
				}}
				variant="permanent"
				anchor="left"
			>
				<Toolbar />
				<Divider />
				<List>
					<SideBarItemList/>
				</List>
				<Divider />
			</Drawer>
			<Box
				component="main"
				sx={{ flexGrow: 1, bgcolor: 'black', p: 3 }}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	)
}

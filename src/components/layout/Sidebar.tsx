'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';
import ThemeToggle from './ThemeToggle';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Photo as PhotoIcon,
  Videocam as VideoCameraIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Task as TaskIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 64;

const navLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/generate/image', label: 'Generate Image', icon: PhotoIcon },
  { href: '/generate/video', label: 'Generate Video', icon: VideoCameraIcon },
  { href: '/gallery', label: 'Gallery', icon: PhotoLibraryIcon },
  { href: '/logs', label: 'Activity Logs', icon: TaskIcon },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
  { href: '/about', label: 'About', icon: InfoIcon },
  { href: '/help', label: 'Help', icon: HelpIcon },
];

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const { userName, isAuthenticated } = useAuth();
  const { config, updateConfig } = useConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isCollapsed = config.sidebarCollapsed;
  const position = config.sidebarPosition;
  const drawerWidth = isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleCollapseToggle = () => {
    updateConfig({ sidebarCollapsed: !isCollapsed });
  };

  // For left/right positioned sidebars
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Collapse/Expand Toggle (top right) */}
      {!isMobile && (position === 'left' || position === 'right') && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title={isCollapsed ? 'Expand' : 'Collapse'}>
            <IconButton size="small" onClick={handleCollapseToggle} sx={{ width: 32, height: 32 }}>
              {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Logo / Brand */}
      {!isCollapsed && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🍌 POLO BANANA
            </Typography>
          </Link>
        </Box>
      )}

      {!isCollapsed && <Divider />}

      {/* Navigation Links */}
      <List sx={{ flex: 1, overflow: 'auto', px: isCollapsed ? 0.5 : 0 }}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <ListItem key={link.href} disablePadding>
              <Link href={link.href} style={{ width: '100%', textDecoration: 'none' }} onClick={handleNavClick}>
                <Tooltip title={isCollapsed ? link.label : ''} placement="right">
                  <ListItemButton sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40 }}>
                      <Icon />
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={link.label} />}
                  </ListItemButton>
                </Tooltip>
              </Link>
            </ListItem>
          );
        })}
      </List>

      {!isCollapsed && <Divider />}

      {/* User Info & Actions */}
      {!isCollapsed && (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isAuthenticated && (
            <>
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Signed in as
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                {userName || 'User'}
              </Typography>
              <ListItem disablePadding>
                <ListItemButton onClick={handleSignOut} sx={{ borderRadius: 1 }}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {/* Theme Toggle */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <ThemeToggle />
          </Box>
        </Box>
      )}

      {/* Collapsed user info (icon only) */}
      {isCollapsed && (
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {isAuthenticated && (
            <>
              <Tooltip title="Sign out" placement="right">
                <IconButton size="small" onClick={handleSignOut} sx={{ width: 36, height: 36 }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ThemeToggle />
          </Box>
        </Box>
      )}
    </Box>
  );

  // For top/bottom positioned sidebars
  if (position === 'top' || position === 'bottom') {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: position === 'bottom' ? 'column-reverse' : 'column' }}>
        {/* Horizontal AppBar */}
        <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ gap: 1, overflowX: 'auto', overflowY: 'hidden' }}>
            <Typography sx={{ mr: 2, fontWeight: 'bold', whiteSpace: 'nowrap' }}>🍌 POLO</Typography>

            {/* Navigation Buttons */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, flex: 1, overflowX: 'auto' }}>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }} onClick={handleNavClick}>
                      <Button
                        component="span"
                        size="small"
                        startIcon={<Icon />}
                        sx={{ color: 'inherit', whiteSpace: 'nowrap', minWidth: 'fit-content' }}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </Box>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ ml: 'auto' }}>
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}

            {/* Theme Toggle */}
            <Box sx={{ ml: isMobile ? 0 : 'auto' }}>
              <ThemeToggle />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  // Default: left/right positioned sidebars
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: position === 'right' ? 'row-reverse' : 'row' }}>
      {/* Top App Bar (mobile only) */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 2 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
              🍌 POLO BANANA
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Drawer (permanent) */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          anchor={position === 'right' ? 'right' : 'left'}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: 1,
              transition: 'width 0.3s ease',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Drawer (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          mt: isMobile ? '56px' : 0,
          transition: 'width 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

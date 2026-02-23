'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
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
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo / Brand */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🍌 POLO BANANA
          </Typography>
        </Link>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <ListItem key={link.href} disablePadding>
              <Link href={link.href} style={{ width: '100%', textDecoration: 'none' }} onClick={handleNavClick}>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Info & Actions */}
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
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: 1,
          },
        }}
      >
        {drawerContent}
      </Drawer>

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
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          mt: isMobile ? '56px' : 0, // Account for AppBar height on mobile (56px is default)
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

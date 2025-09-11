import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ShoppingCart, User, LogOut, Coffee, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { cartAPI } from '../../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get(),
    enabled: !!user,
    staleTime: 30_000,
  });

  const cartCount = useMemo(() => {
    const items = cartData?.data?.cart?.items || cartData?.data?.items || [];
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 border-b shadow",
      "navbar-cafe text-white"
    )}>
      <nav className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8")}
        aria-label="Global">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-white hover:text-white/90">
            <Coffee className="h-5 w-5" />
            <span>Cafe Delight</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white hover:text-white/90">Home</Link>
            <Link to="/menu" className="text-white hover:text-white/90">Menu</Link>
            <Link to="/cart" className="text-white hover:text-white/90">Cart</Link>
            {user && (
              <>
                <Link to="/orders" className="text-white hover:text-white/90">Orders</Link>
                <Link to="/profile" className="text-white hover:text-white/90">Profile</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-white hover:text-white/90">Admin Panel</Link>
                )}
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="text-white hover:text-white/90">Login</Link>
                <Link to="/register" className="text-white hover:text-white/90">Register</Link>
                <Link to="/admin/login" className="text-white hover:text-white/90">Admin Login</Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cart" className="relative inline-flex items-center justify-center text-white hover:text-white/90" aria-label={`Cart${cartCount ? ` (${cartCount})` : ''}`}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 min-w-[18px] h-[18px] p-0 text-[11px] flex items-center justify-center">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 text-white hover:text-white/90">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white text-cafe-primary">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-white text-white bg-white/20 hover:bg-white/30 shadow-none"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  className="bg-white text-cafe-primary hover:bg-white/90"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10"
            aria-label="Toggle navigation"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-3 space-y-2 text-white">
            <div className="grid gap-2">
              <Link to="/" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/menu" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
              <Link to="/cart" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link>
              {user && (
                <>
                  <Link to="/orders" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                  <Link to="/profile" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                  {isAdmin && (
                    <Link to="/admin" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
                  )}
                </>
              )}
              {!user && (
                <>
                  <Link to="/login" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                  <Link to="/admin/login" className="px-1 py-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Admin Login</Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link to="/cart" className="relative inline-flex items-center justify-center" onClick={() => setIsMobileMenuOpen(false)} aria-label={`Cart${cartCount ? ` (${cartCount})` : ''}`}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 min-w-[18px] h-[18px] p-0 text-[11px] flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Link>
              {user ? (
                <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="border-white text-white bg-white/20 hover:bg-white/30 shadow-none" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
                    Login
                  </Button>
                  <Button className="bg-white text-cafe-primary hover:bg-white/90" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}>
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

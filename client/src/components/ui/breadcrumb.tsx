import React, { useEffect, useState } from "react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBackToTop?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showBackToTop = true, className = "" }: BreadcrumbProps) {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    if (!showBackToTop) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackButton(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBackToTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className={`breadcrumb-nav ${className}`}>
        <div className="flex items-center flex-wrap gap-1">
          {items.map((item, index) => (
            <div key={index} className="breadcrumb-item">
              {index > 0 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  <i className="fas fa-chevron-right text-xs"></i>
                </span>
              )}
              {item.href ? (
                <Link href={item.href} className="breadcrumb-link">
                  {item.icon && (
                    <i className={`${item.icon} breadcrumb-icon`} aria-hidden="true"></i>
                  )}
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.icon && (
                    <i className={`${item.icon} breadcrumb-icon`} aria-hidden="true"></i>
                  )}
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {showBackToTop && (
        <button
          className={`back-to-top ${showBackButton ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <i className="fas fa-chevron-up" aria-hidden="true"></i>
        </button>
      )}
    </>
  );
}

interface SmartBreadcrumbProps {
  maxItems?: number;
  showBackToTop?: boolean;
  className?: string;
}

export function SmartBreadcrumb({ maxItems = 3, showBackToTop = true, className = "" }: SmartBreadcrumbProps) {
  // Auto-generate breadcrumb from current URL
  const path = window.location.pathname;
  const segments = path.split('/').filter(segment => segment !== '');
  
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: 'fas fa-home' }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert URL segments to readable labels
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Add appropriate icons based on segment
    let icon = '';
    if (segment === 'documents') icon = 'fas fa-file-text';
    else if (segment === 'settings') icon = 'fas fa-cog';
    else if (segment === 'design-system') icon = 'fas fa-palette';
    else if (segment === 'llm-models') icon = 'fas fa-brain';

    items.push({
      label,
      href: isLast ? undefined : currentPath,
      icon
    });
  });

  // Handle long breadcrumb paths
  let displayItems = items;
  if (items.length > maxItems) {
    displayItems = [
      items[0], // Home
      { label: '...', href: undefined }, // Ellipsis
      ...items.slice(-2) // Last 2 items
    ];
  }

  return <Breadcrumb items={displayItems} showBackToTop={showBackToTop} className={className} />;
}
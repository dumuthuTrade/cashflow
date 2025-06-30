import { useSidebar } from '../../hooks/useSidebar';

const Backdrop = () => {
  const { isMobileOpen, closeMobile } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      onClick={closeMobile}
      aria-hidden="true"
    />
  );
};

export default Backdrop;

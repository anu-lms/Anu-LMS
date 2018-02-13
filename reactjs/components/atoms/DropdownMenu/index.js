import Dropdown from '@trendmicro/react-dropdown';

export const MenuIcon = () => (
  <div className="menu-icon-dropdown">
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20">
      <g fill="none" fillRule="evenodd">
        <path fill="#b2b2b2" fillRule="nonzero" d="M3 5c1.375 0 2.5-1.125 2.5-2.5S4.375 0 3 0A2.507 2.507 0 0 0 .5 2.5C.5 3.875 1.625 5 3 5zm0 2.5A2.507 2.507 0 0 0 .5 10c0 1.375 1.125 2.5 2.5 2.5s2.5-1.125 2.5-2.5S4.375 7.5 3 7.5zM3 15a2.507 2.507 0 0 0-2.5 2.5C.5 18.875 1.625 20 3 20s2.5-1.125 2.5-2.5S4.375 15 3 15z" />
      </g>
    </svg>
  </div>
);

export default Dropdown;
export {
  DropdownToggle,
  DropdownMenu,
  DropdownMenuWrapper,
  MenuItem,
  DropdownButton
} from '@trendmicro/react-dropdown';
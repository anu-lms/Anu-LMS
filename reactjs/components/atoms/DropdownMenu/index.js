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

export const DeleteIcon = () => (
  <span className='menu-icon menu-icon-delete'>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18">
      <g fill="none" fillRule="evenodd">
        <path fill="#b2b2b2" fillRule="nonzero" d="M1 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4H1v12zM14 1h-3.5l-1-1h-5l-1 1H0v2h14V1z" />
        <path d="M-5-3h24v24H-5z" />
      </g>
    </svg>

  </span>
)

export default Dropdown;
export {
  DropdownToggle,
  DropdownMenu,
  DropdownMenuWrapper,
  MenuItem,
  DropdownButton
} from '@trendmicro/react-dropdown';
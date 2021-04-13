import DarkModeToggle from "./DarkModeToggle"

const Header = ({ title, onToggle }) => {
    return (
        <div className="flex flex-row w-full items-center justify-between">
            <h1 className="header">{title}</h1>
            <DarkModeToggle onToggle={onToggle} />
        </div>
    )
}

export default Header

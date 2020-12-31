const Button = ({ children, icon, disabled, className = "", ...rest }) => {
  return (
    <button {...rest} disabled={disabled} className={`border-2 border-white py-2 min-w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <div className="flex justify-center text-sm">
        <div>
          {children}
        </div>
        {icon && <div className="ml-3">
          <img src={icon} alt="icon" />
        </div>}
      </div>
    </button>
  )
}

export { Button }

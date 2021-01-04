import Tooltip from './Tooltip'

const ValueItem = ({ children, value, bigValue = false, bold = false, icon, tooltipText }) => {
  return (
    <div className="mx-4 mb-6 text-sm">
      <div className={`${bold ? "text-white font-bold" : "text-gray-400 font-normal"} mb-2`}>
        {tooltipText
          ? <div className="flex justify-center items-center">
              <div className="mr-2">{children}</div>
              <Tooltip>{tooltipText}</Tooltip>
            </div>
          : children}
      </div>
      <div className={`${bigValue ? "text-lg" : "text-sm"} ${bold ? "font-bold" : "font-normal"}`}>
        {icon
          ? <div className="flex justify-center items-center">
              <div className="mr-2">
                <img src={icon} alt="icon" />
              </div>
              <div>{value}</div>
            </div>
          : value
        }
      </div>
    </div>
  )
}

const Row = ({ children, value, total }) => {
  return (
    <div className="flex mb-1 items-center">
      <div className="w-1/2 text-right text-gray-400">
        {children}
      </div>
      <div className={`w-1/2 ml-2 text-right truncate ${total ? "font-bold": ""}`}>
        {value}
      </div>
    </div>
  )
}

export { ValueItem, Row }

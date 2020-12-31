const ValueItem = ({ children, value, bigValue = false, bold = false, icon }) => {
  return (
    <div className="mx-4 mb-6 text-sm">
      <div className={`${bold ? "text-white font-bold" : "text-gray-400 font-normal"} mb-2`}>
        {children}
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
    <div className="flex mb-1">
      <div className="w-3/5 text-right text-gray-400">
        {children}
      </div>
      <div className={`w-2/5 text-right ${total ? "font-bold": ""}`}>
        {value}
      </div>
    </div>
  )
}

export { ValueItem, Row }

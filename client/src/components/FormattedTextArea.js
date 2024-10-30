import React, { useState } from 'react'

export function formatText(text, format) {
    switch (format) {
      case 'json':
        try {
          return JSON.stringify(JSON.parse(text), null, 2)
        } catch {
          return text
        }
      case 'sql':
        return text.replace(/\s+/g, ' ').replace(/\s*([(),])\s*/g, '$1\n').trim()
      case 'csv':
        return text.split('\n').map(line => line.split(',').map(cell => cell.trim()).join(', ')).join('\n')
      default:
        return text
    }
  }
  
export default function FormattedTextArea({ value, onChange, format }) {
    const lines = value.split('\n')
    const [isFocused, setIsFocused] = useState(false)
  
    return (
      <div className={`relative w-full h-64 border rounded-md overflow-hidden bg-white transition-shadow duration-200 ${
        isFocused ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}>
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-100 flex flex-col items-center pt-2 text-sm text-gray-500">
          {lines.map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(formatText(e.target.value, format))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full h-full pl-10 pr-2 py-2 resize-none focus:outline-none font-mono text-sm"
          spellCheck={false}
          placeholder={`Enter your ${format.toUpperCase()} here...`}
          aria-label={`${format.toUpperCase()} input area`}
        />
        {format === 'json' && (
          <div className="absolute right-2 top-2 text-xs text-gray-400">
            JSON
          </div>
        )}
      </div>
    )
}
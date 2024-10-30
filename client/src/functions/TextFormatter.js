// export function formatText(text, format) {
//     switch (format) {
//       case 'json':
//         try {
//           return JSON.stringify(JSON.parse(text), null, 2)
//         } catch {
//           return text
//         }
//       case 'sql':
//         // Basic SQL formatting (you may want to use a more robust SQL formatter)
//         return text.replace(/\s+/g, ' ').replace(/\s*([(),])\s*/g, '$1\n').trim()
//       case 'csv':
//         // Basic CSV formatting (you may want to use a CSV parsing library for more robust handling)
//         return text.split('\n').map(line => line.split(',').map(cell => cell.trim()).join(', ')).join('\n')
//       default:
//         return text
//     }
//   }
  
//   export function compareTexts(source, target, format) {
//     const sourceLines = source.split('\n')
//     const targetLines = target.split('\n')
//     const mismatches = []
  
//     switch (format) {
//       case 'json':
//         try {
//           const sourceObj = JSON.parse(source)
//           const targetObj = JSON.parse(target)
//           const mismatchedKeys = findMismatchedKeys(sourceObj, targetObj)
//           for (const key of mismatchedKeys) {
//             mismatches.push({
//               line: findLineForKey(source, key),
//               source: `${key}: ${JSON.stringify(sourceObj[key])}`,
//               target: `${key}: ${JSON.stringify(targetObj[key])}`
//             })
//           }
//         } catch {
//           // If JSON parsing fails, fall back to line-by-line comparison
//           compareLinesWithFormat(sourceLines, targetLines, mismatches, format)
//         }
//         break
//       case 'sql':
//       case 'csv':
//       case 'txt':
//       default:
//         compareLinesWithFormat(sourceLines, targetLines, mismatches, format)
//         break
//     }
  
//     return { mismatches }
//   }
  
//   function compareLinesWithFormat(sourceLines, targetLines, mismatches, format) {
//     const maxLines = Math.max(sourceLines.length, targetLines.length)
//     for (let i = 0; i < maxLines; i++) {
//       const sourceLine = sourceLines[i] || ''
//       const targetLine = targetLines[i] || ''
//       if (formatText(sourceLine, format) !== formatText(targetLine, format)) {
//         mismatches.push({
//           line: i + 1,
//           source: sourceLine,
//           target: targetLine
//         })
//       }
//     }
//   }
  
//   function findMismatchedKeys(sourceObj, targetObj, prefix = '') {
//     const mismatches = []
  
//     for (const key in sourceObj) {
//       const fullKey = prefix ? `${prefix}.${key}` : key
//       if (!(key in targetObj)) {
//         mismatches.push(fullKey)
//       } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
//         mismatches.push(...findMismatchedKeys(sourceObj[key], targetObj[key], fullKey))
//       } else if (sourceObj[key] !== targetObj[key]) {
//         mismatches.push(fullKey)
//       }
//     }
  
//     for (const key in targetObj) {
//       const fullKey = prefix ? `${prefix}.${key}` : key
//       if (!(key in sourceObj)) {
//         mismatches.push(fullKey)
//       }
//     }
  
//     return mismatches
//   }
  
//   function findLineForKey(jsonString, key) {
//     const lines = jsonString.split('\n')
//     const keyParts = key.split('.')
//     let currentObj = JSON.parse(jsonString)
//     let lineNumber = 1
  
//     for (const part of keyParts) {
//       const regex = new RegExp(`"${part}"\\s*:`)
//       for (let i = lineNumber - 1; i < lines.length; i++) {
//         if (regex.test(lines[i])) {
//           lineNumber = i + 1
//           break
//         }
//       }
//       currentObj = currentObj[part]
//     }
  
//     return lineNumber
//   }

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
  
  function compareJSON(source, target) {
    const mismatches = []
    
    function compareObjects(sourceObj, targetObj, path = '') {
      // Get all keys from both objects
      const allKeys = new Set([...Object.keys(sourceObj), ...Object.keys(targetObj)])
      
      for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key
        const sourceValue = sourceObj[key]
        const targetValue = targetObj[key]
        
        // If key doesn't exist in one of the objects
        if (!(key in sourceObj)) {
          mismatches.push({
            line: findLineInJSON(target, currentPath),
            source: `${currentPath}: undefined`,
            target: `${currentPath}: ${JSON.stringify(targetValue)}`
          })
          continue
        }
        if (!(key in targetObj)) {
          mismatches.push({
            line: findLineInJSON(source, currentPath),
            source: `${currentPath}: ${JSON.stringify(sourceValue)}`,
            target: `${currentPath}: undefined`
          })
          continue
        }
        
        // If values are different
        if (typeof sourceValue !== typeof targetValue) {
          mismatches.push({
            line: findLineInJSON(source, currentPath),
            source: `${currentPath}: ${JSON.stringify(sourceValue)}`,
            target: `${currentPath}: ${JSON.stringify(targetValue)}`
          })
        } else if (typeof sourceValue === 'object' && sourceValue !== null) {
          // For arrays and objects, recurse
          if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
            // Compare arrays
            sourceValue.forEach((item, index) => {
              if (index < targetValue.length) {
                compareObjects(item, targetValue[index], `${currentPath}[${index}]`)
              }
            })
          } else if (!Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
            // Compare objects
            compareObjects(sourceValue, targetValue, currentPath)
          }
        } else if (sourceValue !== targetValue) {
          mismatches.push({
            line: findLineInJSON(source, currentPath),
            source: `${currentPath}: ${JSON.stringify(sourceValue)}`,
            target: `${currentPath}: ${JSON.stringify(targetValue)}`
          })
        }
      }
    }
    
    try {
      const sourceObj = JSON.parse(source)
      const targetObj = JSON.parse(target)
      compareObjects(sourceObj, targetObj)
    } catch (error) {
      console.error('JSON parsing error:', error)
      return { mismatches: [{ line: 1, source: 'Invalid JSON', target: 'Invalid JSON' }] }
    }
    
    return { mismatches }
  }
  
  function findLineInJSON(jsonString, path) {
    const lines = jsonString.split('\n')
    const parts = path.replace(/\[\d+\]/g, '').split('.')
    let lineNumber = 1
    
    for (const part of parts) {
      const regex = new RegExp(`"${part}"\\s*:`)
      for (let i = lineNumber - 1; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          lineNumber = i + 1
          break
        }
      }
    }
    
    return lineNumber
  }
  
  export function compareTexts(source, target, format) {
    const sourceLines = source.trim().split('\n')
    const targetLines = target.trim().split('\n')
    const mismatches = []
    
    // Calculate line statistics
    const stats = {
      sourceLineCount: sourceLines.length,
      targetLineCount: targetLines.length,
      newLinesInSource: 0,
      newLinesInTarget: 0
    }
  
    // Count trailing new lines
    const sourceTrailingNewLines = (source.match(/\n\s*$/g) || []).length
    const targetTrailingNewLines = (target.match(/\n\s*$/g) || []).length
    
    stats.newLinesInSource = sourceTrailingNewLines
    stats.newLinesInTarget = targetTrailingNewLines
  
    switch (format) {
      case 'json':
        try {
          const result = compareJSON(source, target)
          return {
            ...result,
            stats
          }
        } catch (error) {
          return {
            mismatches: [{ line: 1, source: 'Invalid JSON', target: 'Invalid JSON' }],
            stats
          }
        }
      case 'sql':
      case 'csv':
      case 'txt':
      default:
        const maxLines = Math.max(sourceLines.length, targetLines.length)
        
        // Compare content without considering trailing new lines
        for (let i = 0; i < maxLines; i++) {
          const sourceLine = sourceLines[i] || ''
          const targetLine = targetLines[i] || ''
          
          // Only compare if the content is different (ignoring pure whitespace lines)
          if (sourceLine.trim() !== targetLine.trim() && 
              (sourceLine.trim() !== '' || targetLine.trim() !== '')) {
            mismatches.push({
              line: i + 1,
              source: sourceLine,
              target: targetLine
            })
          }
        }
        
        return { mismatches, stats }
    }
  }
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, FileText, Check, AlertTriangle } from 'lucide-react'

import FormattedTextArea from './FormattedTextArea';
import LoadingScreen from './LoadingScreen';
// Helper functions
import { compareTexts } from '../functions/TextFormatter'

// Custom components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

const SuccessAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0, rotateX: -180 }}
      animate={{ 
        scale: 1, 
        rotateX: 0,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20
        }
      }}
      exit={{ scale: 0, rotateX: 180 }}
      className="bg-green-100 p-8 rounded-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          transition: {
            delay: 0.3,
            times: [0, 0.5, 1],
            duration: 0.6
          }
        }}
      >
        <Check className="w-16 h-16 text-green-600" />
      </motion.div>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute mt-32 text-xl font-semibold text-green-600"
    >
      Perfect Match!
    </motion.h2>
  </motion.div>
)

function LineStatistics({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4"
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-500">Source</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{stats.sourceLineCount} lines</span>
          </div>
          {stats.newLinesInSource > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-500"
            >
              <span className="text-sm">+{stats.newLinesInSource} new line{stats.newLinesInSource > 1 ? 's' : ''}</span>
            </motion.div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-500">Target</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{stats.targetLineCount} lines</span>
          </div>
          {stats.newLinesInTarget > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-500"
            >
              <span className="text-sm">+{stats.newLinesInTarget} new line{stats.newLinesInTarget > 1 ? 's' : ''}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const MismatchAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 pointer-events-none bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-40"
  >
    <motion.div
      initial={{ scale: 0, rotateY: -180 }}
      animate={{ 
        scale: 1, 
        rotateY: 0,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20
        }
      }}
      exit={{ scale: 0, rotateY: 180 }}
      className="bg-red-100/90 p-8 rounded-full"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, -5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: 1,
          repeatType: "reverse"
        }}
      >
        <AlertTriangle className="w-16 h-16 text-red-600" />
      </motion.div>
    </motion.div>
  </motion.div>
)

// ... (keep the LoadingScreen and FormattedTextArea components unchanged)

export default function TextDifferenceChecker() {
  const [sourceText, setSourceText] = useState('')
  const [targetText, setTargetText] = useState('')
  const [format, setFormat] = useState('txt')
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showMismatchAnimation, setShowMismatchAnimation] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleCompare = async () => {
    setIsComparing(true)
    setShowSuccessAnimation(false)
    setShowMismatchAnimation(false)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    const result = compareTexts(sourceText, targetText, format)
    setComparisonResult(result)
    
    // Show appropriate animation
    if (result.mismatches.length === 0) {
      setShowSuccessAnimation(true)
      setTimeout(() => setShowSuccessAnimation(false), 2500)
    } else {
      setShowMismatchAnimation(true)
      setTimeout(() => setShowMismatchAnimation(false), 2000)
    }
    
    setIsComparing(false)
  }

  const isCheckDisabled = !sourceText || !targetText || isComparing

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
        {showSuccessAnimation && <SuccessAnimation />}
        {showMismatchAnimation && <MismatchAnimation />}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto p-4 max-w-4xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-6 h-6" />
          <h1 className="text-2xl font-bold">PolarChecker</h1>
        </div>

        <div className="relative z-50 mb-8">
          <Select value={format} onValueChange={(value) => setFormat(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
              <SelectItem value="txt">Plain Text</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-0">
          <div>
            <h2 className="text-lg font-semibold mb-2">Source</h2>
            <FormattedTextArea value={sourceText} onChange={setSourceText} format={format} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Target</h2>
            <FormattedTextArea value={targetText} onChange={setTargetText} format={format} />
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <Button onClick={handleCompare} disabled={isCheckDisabled}>
            {isComparing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              'Compare'
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {comparisonResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-0"
            >
              <Card>
                <CardContent className="pt-6">
                  {/* Add LineStatistics component */}
                  <LineStatistics stats={comparisonResult.stats} />
                  
                  <motion.h3 
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {comparisonResult.mismatches.length === 0 ? (
                      <>
                        <Check className="w-5 h-5 text-green-500" />
                        Texts Match
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Found {comparisonResult.mismatches.length} differences
                      </>
                    )}
                  </motion.h3>
                  {comparisonResult.mismatches.map((mismatch, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-6 last:mb-0"
                    >
                      <p className="font-medium text-sm text-gray-500 mb-2">Line {mismatch.line}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-red-500">Source:</p>
                          <pre className="bg-red-50 p-3 rounded-md text-sm font-mono whitespace-pre-wrap break-all">
                            {mismatch.source}
                          </pre>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-green-500">Target:</p>
                          <pre className="bg-green-50 p-3 rounded-md text-sm font-mono whitespace-pre-wrap break-all">
                            {mismatch.target}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
export default function LoadingScreen() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            <Code2 className="w-12 h-12 text-primary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold"
          >
            Polarity Checker
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground"
          >
            Loading your workspace...
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }
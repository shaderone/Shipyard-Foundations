import { useState } from 'react'

const pipelineSteps = [
  {
    id: 'checkout',
    label: 'Checkout',
    description: 'Pulls the latest code from the main branch into the GitHub actions runner environment.',
    code: `- name: move code to Runner
  uses: actions/checkout@v4`
  },
  {
    id: 'setup-node',
    label: 'Setup Node',
    description: 'Initializes Node.js v20 to prepare the environment for building the React application.',
    code: `- name: Setup Node (because its a react app)
  uses: actions/setup-node@v4
  with:
    node-version: '20'`
  },
  {
    id: 'install',
    label: 'Install dependencies',
    description: 'Downloads and installs all the necessary project dependencies defined in package.json.',
    code: `- name: Install dependencies (npm i)
  run: npm install`
  },
  {
    id: 'build',
    label: 'Build the app',
    description: 'Compiles the React code into optimized static files using Vite, generating the dist folder.',
    code: `- name: Build the app (npm run build)
  run: npm run build`
  },
  {
    id: 'setup-pages',
    label: 'Setup GitHub Pages natively',
    description: 'Configures and authorizes the repository natively to deploy outputs to GitHub Pages.',
    code: `- name: Setup GitHub Pages natively
  uses: actions/configure-pages@v4`
  },
  {
    id: 'upload',
    label: 'Upload the dist folder as an artifact',
    description: 'Packages the dist folder containing the production build and uploads it securely to GitHub.',
    code: `- name: Upload the dist folder as an artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'`
  },
  {
    id: 'deploy',
    label: 'Deploy to GitHub Pages',
    description: 'Takes the uploaded artifact package and publishes it live to the GitHub Pages URL.',
    code: `- name: Deploy the artifact directly to the GitHub Pages environment
  id: deployment
  uses: actions/deploy-pages@v4`
  }
]

function App() {
  const [litStep, setLitStep] = useState(0) // How far the light beam has traveled on the line
  const [viewStep, setViewStep] = useState(0) // Which page the camera is currently looking at
  const [isMoving, setIsMoving] = useState(false)

  const handleNext = () => {
    setIsMoving(true)

    // 1. Instantly start shooting the light down the line
    setLitStep(prev => prev + 1)

    // 2. Wait a moment to let the user see the light start moving, then pan the camera to follow it
    setTimeout(() => {
      setViewStep(prev => prev + 1)
      setIsMoving(false)
    }, 450)
  }

  const handleReset = () => {
    // 1. Immediately pan the camera back to start
    setViewStep(0)
    // 2. Rewind the light immediately
    setLitStep(0)
  }

  return (
    <div className="overflow-hidden w-screen h-screen bg-[#050505] text-white font-sans relative flex items-center">

      {/* 
        The sliding track that contains all the pages.
        Total width: (Number of steps + 1 Success screen) * 100vw
      */}
      <div
        className="flex h-[100vh] transition-transform ease-out"
        style={{
          width: `${(pipelineSteps.length + 1) * 100}vw`,
          transform: `translateX(-${viewStep * 100}vw)`,
          transitionDuration: '800ms'
        }}
      >

        {/* --- THE BACKGROUND PIPELINE WIRE --- */}
        {/* This faded line stretches from the center of the first page to the center of the last page */}
        <div
          className="absolute top-1/2 h-[2px] bg-gray-800 -translate-y-1/2 z-0"
          style={{
            left: '50vw',
            width: `${pipelineSteps.length * 100}vw`
          }}
        />

        {/* --- THE GLOWING SIGNAL WIRE --- */}
        {/* This is the light that gets active when a button is clicked till the next button */}
        <div
          className="absolute top-1/2 h-[3px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] -translate-y-1/2 z-0 transition-all ease-in-out"
          style={{
            left: '50vw',
            width: `${litStep * 100}vw`,
            transitionDuration: '1000ms'
          }}
        />

        {/* --- RENDER PIPELINE STEP PAGES --- */}
        {pipelineSteps.map((step, index) => {
          const isActiveNode = litStep >= index; // Node is lit if the signal reached or passed it

          return (
            <div key={step.id} className="flex-none w-screen flex flex-col items-center justify-center relative z-10">
              <h2 className="absolute top-1/4 text-gray-600 uppercase tracking-[0.3em] text-xs font-semibold">
                Pipeline Stage {index + 1}
              </h2>

              <button
                onClick={handleNext}
                disabled={isMoving || viewStep !== index}
                className={`px-10 py-5 rounded-md text-lg font-bold tracking-wide transition-all duration-500 border-2
                  ${isActiveNode
                    ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer hover:bg-cyan-400 hover:scale-105'
                    : 'bg-[#111] border-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {step.label}
              </button>

              <div className={`absolute bottom-[15%] w-full flex justify-center transition-all duration-700 ${isActiveNode ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'}`}>
                <div className="bg-[#0a0a0a] border border-gray-800 p-5 rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.05)] w-11/12 max-w-2xl relative">
                  <div className="absolute -top-3 left-4 bg-[#0a0a0a] px-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                    deploy.yml snippet
                  </div>
                  <pre className="text-left font-mono text-sm text-cyan-300 overflow-x-auto whitespace-pre-wrap mb-4">
                    <code>{step.code}</code>
                  </pre>
                  <p className="border-t border-gray-800 pt-3 text-sm text-gray-400 text-left">
                    <span className="text-cyan-600 font-semibold mr-2">{"//"}</span>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {/* --- RENDER FINAL SUCCESS PAGE --- */}
        <div className="flex-none w-screen flex flex-col items-center justify-center relative z-10 text-center">
          <div className="absolute top-1/4 -translate-y-1/2 flex flex-col items-center w-full">
            <h1 className="text-5xl font-bold text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              Deployment Success!
            </h1>
            <p className="text-gray-400 text-lg">
              All pipeline operations completed successfully.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-[#050505] border-2 border-cyan-500 text-cyan-400 rounded-full font-bold hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_#22d3ee] transition-all relative z-10"
          >
            Redeploy Application
          </button>
        </div>

      </div>
    </div>
  )
}

export default App

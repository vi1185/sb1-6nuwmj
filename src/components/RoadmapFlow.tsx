import { useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, Panel } from 'reactflow';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../lib/store';
import CustomNode from './CustomNode';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

interface RoadmapFlowProps {
  userInput: string;
  setUserInput: (input: string) => void;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function RoadmapFlow({
  userInput,
  setUserInput,
  onGenerate,
  isLoading,
  error
}: RoadmapFlowProps) {
  const { 
    nodes, 
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore();

  // Handle resize observer cleanup
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          entry.target.style.height = `${entry.contentRect.height}px`;
        }
      }
    });

    const flowContainer = document.querySelector('.react-flow');
    if (flowContainer) {
      resizeObserver.observe(flowContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow"
      >
        <Background />
        <Controls />
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-800">AI Career Roadmap Generator</h1>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your AI career goal..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={onGenerate}
                  disabled={isLoading || !userInput.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Roadmap'
                  )}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
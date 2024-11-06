import { useState, useCallback } from 'react';
import RoadmapFlow from './components/RoadmapFlow';
import { generateRoadmap } from './lib/aiService';
import { useStore } from './lib/store';

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setNodes, setEdges, setIsLoading, isLoading } = useStore();

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const roadmapNodes = await generateRoadmap(userInput);
      
      const newNodes = roadmapNodes.map((node, index) => ({
        id: node.id,
        type: 'custom',
        position: { x: 250, y: index * 300 },
        data: {
          title: node.title,
          description: node.description,
          skills: node.skills,
          resources: node.resources,
        },
      }));

      const newEdges = roadmapNodes.slice(0, -1).map((_, index) => ({
        id: `e${index}`,
        source: roadmapNodes[index].id,
        target: roadmapNodes[index + 1].id,
        type: 'smoothstep',
        animated: true,
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setNodes([]);
      setEdges([]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, setNodes, setEdges, setIsLoading]);

  return (
    <RoadmapFlow
      userInput={userInput}
      setUserInput={setUserInput}
      onGenerate={handleGenerate}
      isLoading={isLoading}
      error={error}
    />
  );
}
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { BookOpen, Lightbulb } from 'lucide-react';

interface CustomNodeProps {
  data: {
    title: string;
    description: string;
    skills: string[];
    resources: string[];
  };
}

const CustomNode = memo(({ data }: CustomNodeProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-[300px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">{data.title}</h2>
        
        <p className="text-sm text-gray-600">{data.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Key Skills</span>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Resources</span>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
            {data.resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
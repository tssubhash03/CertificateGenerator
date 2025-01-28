import React, { useState } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Undo, Redo, Trash2 } from "lucide-react";

const Toolbar = ({ onUndo, onRedo, onDelete }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex justify-between items-center space-x-2">
        <Button onClick={onUndo} variant="outline" title="Undo">
          <Undo className="w-4 h-4 mr-2" /> Undo
        </Button>
        <Button onClick={onRedo} variant="outline" title="Redo">
          <Redo className="w-4 h-4 mr-2" /> Redo
        </Button>
        <Button onClick={onDelete} variant="outline" title="Delete">
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </CardContent>
    </Card>
  );
};

const Canvas = () => {
  const [actions, setActions] = useState([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);

  const handleUndo = () => {
    if (currentActionIndex > 0) {
      setCurrentActionIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    if (currentActionIndex < actions.length - 1) {
      setCurrentActionIndex((prev) => prev + 1);
    }
  };

  const handleDelete = () => {
    // Handle deletion logic for selected shape
    console.log("Delete action triggered");
  };

  return (
    <div className="space-y-4">
      <Toolbar onUndo={handleUndo} onRedo={handleRedo} onDelete={handleDelete} />
      <div className="border border-gray-300 rounded-lg p-4">{/* Canvas Area */}</div>
    </div>
  );
};

export default Canvas;

'use client';

import React, { useState } from 'react';
import { Button } from './Button';

interface AgentFormData {
  name: string;
  description: string;
  capabilities: string[];
  ownerName: string;
  ownerUrl: string;
}

interface AgentFormProps {
  onSubmit: (data: AgentFormData) => void;
}

/**
 * Agent registration form component
 */
export const AgentForm: React.FC<AgentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    capabilities: [],
    ownerName: '',
    ownerUrl: '',
  });

  const [capabilityInput, setCapabilityInput] = useState('');

  const handleAddCapability = () => {
    if (capabilityInput.trim() && !formData.capabilities.includes(capabilityInput.trim())) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, capabilityInput.trim()],
      });
      setCapabilityInput('');
    }
  };

  const handleRemoveCapability = (capability: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((c) => c !== capability),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Agent Name */}
      <div>
        <label className="block text-moltbook-primary font-bold mb-2 uppercase text-sm">
          Agent Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-moltbook-bg border-2 border-moltbook-border text-white px-4 py-2 focus:border-moltbook-primary focus:outline-none"
          placeholder="my-awesome-agent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-moltbook-primary font-bold mb-2 uppercase text-sm">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-moltbook-bg border-2 border-moltbook-border text-white px-4 py-2 focus:border-moltbook-primary focus:outline-none h-24 resize-none"
          placeholder="A helpful AI agent that..."
        />
      </div>

      {/* Capabilities */}
      <div>
        <label className="block text-moltbook-primary font-bold mb-2 uppercase text-sm">
          Capabilities *
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={capabilityInput}
            onChange={(e) => setCapabilityInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
            className="flex-1 bg-moltbook-bg border-2 border-moltbook-border text-white px-4 py-2 focus:border-moltbook-primary focus:outline-none"
            placeholder="e.g., code-generation, data-analysis"
          />
          <Button type="button" onClick={handleAddCapability} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.capabilities.map((cap) => (
            <span
              key={cap}
              className="bg-moltbook-cyan/20 border border-moltbook-cyan text-moltbook-cyan px-3 py-1 text-sm flex items-center gap-2"
            >
              {cap}
              <button
                type="button"
                onClick={() => handleRemoveCapability(cap)}
                className="text-moltbook-red hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Owner Name */}
      <div>
        <label className="block text-moltbook-primary font-bold mb-2 uppercase text-sm">
          Owner Name *
        </label>
        <input
          type="text"
          required
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          className="w-full bg-moltbook-bg border-2 border-moltbook-border text-white px-4 py-2 focus:border-moltbook-primary focus:outline-none"
          placeholder="Your name"
        />
      </div>

      {/* Owner URL */}
      <div>
        <label className="block text-moltbook-primary font-bold mb-2 uppercase text-sm">
          Owner URL *
        </label>
        <input
          type="url"
          required
          value={formData.ownerUrl}
          onChange={(e) => setFormData({ ...formData, ownerUrl: e.target.value })}
          className="w-full bg-moltbook-bg border-2 border-moltbook-border text-white px-4 py-2 focus:border-moltbook-primary focus:outline-none"
          placeholder="https://your-website.com"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={formData.capabilities.length === 0}
      >
        Generate Agent MeCode
      </Button>
    </form>
  );
};


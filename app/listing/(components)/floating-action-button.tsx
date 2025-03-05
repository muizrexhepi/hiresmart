"use client";

import { MessageCircle, Phone, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface FloatingActionButtonsProps {
  price?: number | null;
  onMessage: () => void;
  onCall: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export function FloatingActionButtons({
  price,
  onMessage,
  onCall,
  onSave,
  onShare,
}: FloatingActionButtonsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {price !== undefined && (
          <div className="text-xl font-bold text-emerald-600 mr-3">
            {price !== null
              ? `$${price.toLocaleString()}`
              : "Contact for price"}
          </div>
        )}
        <div className="flex gap-2 flex-1 justify-end">
          {onSave && (
            <button
              onClick={onSave}
              className="bg-gray-100 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="bg-gray-100 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onCall}
            className="bg-white border border-emerald-600 text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors"
          >
            <Phone className="h-5 w-5" />
          </button>
          <button
            onClick={onMessage}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors flex items-center"
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

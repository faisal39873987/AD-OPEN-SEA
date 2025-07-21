import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusIcon, SettingsIcon, UserIcon, LogOutIcon, UpgradeIcon } from './ui/icons';
import { ThemeToggle } from './ui/theme-toggle';

interface Conversation {
  id: string;
  title: string;
  lastMessageDate: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onUpgrade?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onOpenSettings,
  onLogout,
  onUpgrade,
  user,
}: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      {/* Logo and New Chat Button */}
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logos/logo.png" 
            alt="AD Pulse Logo" 
            width={32} 
            height={32} 
            className="object-contain" 
          />
          <span className="font-semibold text-gray-900 dark:text-white">AD Pulse</span>
        </Link>
        <ThemeToggle />
      </div>
      
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="mx-4 flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <PlusIcon className="h-4 w-4" />
        <span>محادثة جديدة</span>
      </button>

      {/* Conversations List */}
      <div className="mt-4 flex-1 overflow-y-auto">
        <h2 className="px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          المحادثات السابقة
        </h2>
        <nav className="mt-1 space-y-1 px-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full rounded-md px-2 py-2 text-right text-sm ${
                activeConversationId === conversation.id
                  ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <div className="truncate">{conversation.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {conversation.lastMessageDate.toLocaleDateString()}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer with Upgrade Button and User Profile */}
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
        {/* Upgrade Button */}
        <div className="p-3">
          <button
            onClick={onUpgrade}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700"
          >
            <UpgradeIcon className="h-4 w-4" />
            <span>ترقية الحساب</span>
          </button>
        </div>
        
        {/* User Profile */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="flex space-x-1 rtl:space-x-reverse">
                <button
                  onClick={onOpenSettings}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <SettingsIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <UserIcon className="h-4 w-4" />
                <span>تسجيل الدخول</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
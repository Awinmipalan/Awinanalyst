/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '@/src/pages/Landing';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import Dashboard from '@/src/pages/Dashboard';
import DataCenter from '@/src/pages/DataCenter';
import Chat from '@/src/pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="data" element={<DataCenter />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


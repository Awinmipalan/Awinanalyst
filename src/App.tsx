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
import SignIn from '@/src/pages/SignIn';
import SignUp from '@/src/pages/SignUp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="data" element={<DataCenter />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


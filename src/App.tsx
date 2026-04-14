/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import GalleryCurriculum from "./pages/GalleryCurriculum";
import PracticalApplication from "./pages/PracticalApplication";
import DopamineTranslator from "./pages/DopamineTranslator";
import VillainEradication from "./pages/VillainEradication";
import BankRunDefense from "./pages/BankRunDefense";
import PastExamMapping from "./pages/PastExamMapping";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gallery" element={<GalleryCurriculum />} />
          <Route path="practical" element={<PracticalApplication />} />
          <Route path="dopamine" element={<DopamineTranslator />} />
          <Route path="villain" element={<VillainEradication />} />
          <Route path="bankrun" element={<BankRunDefense />} />
          <Route path="exam" element={<PastExamMapping />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

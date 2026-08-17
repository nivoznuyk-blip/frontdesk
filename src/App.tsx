import { Navigate, Route, Routes } from 'react-router-dom';
import KitchenSink from '@/pages/KitchenSink';

export default function App() {
  return (
    <Routes>
      <Route path="/kitchen-sink" element={<KitchenSink />} />
      <Route path="*" element={<Navigate to="/kitchen-sink" replace />} />
    </Routes>
  );
}

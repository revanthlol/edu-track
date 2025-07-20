// frontend/src/App.jsx
// ... all existing imports ...
import AdminUserManagementPage from './pages/AdminUserManagementPage'; // <-- IMPORT

function App() {
  return (<Router><Routes>
    {/* ... public routes ... */}
    <Route element={<ProtectedRoutes />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/my-grades" element={<StudentGradesPage />} />
        <Route path="/dashboard/courses/:courseId" element={<CourseManagementPage />} />
        <Route path="/dashboard/manage-users" element={<AdminUserManagementPage />} /> {/* <-- NEW ADMIN ROUTE */}
      </Route>
    </Route>
  </Routes></Router>);
}
export default App;
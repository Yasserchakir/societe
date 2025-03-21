import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Welcome from './components/Welcome';
import Home from './components/Home';
import Profile from './components/Profile';
//import Dashboard from './components/Dashboard';
import Login from './components/Login';
import GereProfile from './components/GereProfile';
import FamilleProduitListe from './components/familleProduit/FamilleProduitListe';
import FamilleServiceListe from './components/familleService/FamilleServiceListe';
import EditServiceForm from './components/services/EditService';
import AddServiceForm from './components/services/AddServiceForm';
import ServiceList from './components/services/ServiceList';
import DeleteService from './components/services/DeleteService';
import SocieteList from './components/societe/SocieteList';
import CreateSociete from './components/societe/CreateSociete';
import EditSociete from './components/societe/EditSociete';
import ProductsList from './components/product/ProductsList';
import ManageProfile from './components/client/ManageProfile';
import ProductForm from './components/product/AddProduct';
import AddFamilleService from './components/familleService/AddFamilleService';
import UpdateFamilleService from './components/familleService/UpdateFamilleService';
import ManageUsers from './components/admin/ManageUsers';
import Settings from './components/admin/Settings';
import DashboardAdmin from './components/admin/DashboardAdmin';
import PromotionList from './components/promotion/PromotionList';
import PromotionForm from './components/promotion/PromotionForm';
import Analytics from './components/admin/Analytics';
import AdminLayout from './components/admin/AdminLayout';
import DashboardAnalytics from './components/admin/DashboardAnalytics';
import SecteurProduitListe from './components/SecteurProduitListe/SecteurProduitListe';
import BookingServiceCards from './components/client/BookingServiceCards';
import AddSecteurService from './components/SecteurService/AddSecteurService';
import ReservationList from './components/admin/reservation/ReservationList';
import ListSecteurService from './components/SecteurService/ListSecteurService';
import AddSecteurProduit from './components/SecteurProduitListe/AddSecteurProduit';
 function App() {
  return (
    <Router>
      <Routes>
        {/* Routes non-administratives */}
        <Route path="/" element={<Signup />} />
         <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gererprofile" element={<GereProfile />} />
        <Route path="/gererprofile" element={<ManageProfile />} />
        <Route path="/societes" element={<SocieteList />} />
        <Route path="/societes/create" element={<CreateSociete />} />
        <Route path="/societes/edit/:id" element={<EditSociete />} />
        
        <Route path="/admin/analyticsvv" element={<DashboardAnalytics />} />
        {/* Routes administratives avec SidebarAdmin */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="/admin/booking" element={<BookingServiceCards />} />
         <Route path="dashboardadmin" element={<DashboardAdmin />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="myservices" element={<ServiceList />} />
          <Route path="myservices/add" element={<AddServiceForm />} />
          <Route path="service/delete/:id" element={<DeleteService />} />
          <Route path="soc/:id" element={<EditServiceForm />} />
          <Route path="myproducts" element={<ProductsList />} />
          <Route path="add-product" element={<ProductForm />} />         
          <Route path="familleservice" element={<FamilleServiceListe />} />
          <Route path="familleservice/add" element={<AddFamilleService />} />
          <Route path="familleservice/edit/:id" element={<UpdateFamilleService />} />
          <Route path="familleproduit" element={<FamilleProduitListe />} />
          <Route path="societe" element={<SocieteList />} />
          <Route path="promotion" element={<PromotionList />} />
          <Route path="/admin/promotion/new" element={<PromotionForm />} />
          <Route path="promotions/edit/:promotionId" element={<PromotionForm />} />
          <Route path="secteurproduit" element={<SecteurProduitListe/>} />
          <Route path="secteurproduit/new" element={<AddSecteurProduit />}/>
          <Route path="secteurservice/new" element={<AddSecteurService />} />
          <Route path="reserver" element={<ReservationList />} />
          <Route path="secteurservice" element={<ListSecteurService />} />
           <Route path="reports/sales" element={<div>Sales Report Page</div>} />
          <Route path="reports/users" element={<div>Users Report Page</div>} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
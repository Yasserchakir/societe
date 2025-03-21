import React, { useState } from "react";
import AddSecteurService from "./AddSecteurService";
import ListSecteurService from "./ListSecteurService";
import UpdateSecteurService from "./UpdateSecteurService";
import "./SecteurServiceManager.css";

const SecteurServiceManager = () => {
  const [editingService, setEditingService] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleSuccess = () => {
    setEditingService(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="manager-container">
      {!editingService ? (
        <>
          <AddSecteurService onAddSuccess={handleSuccess} />
          <ListSecteurService onEdit={handleEdit} key={refreshTrigger} />
        </>
      ) : (
        <UpdateSecteurService
          service={editingService}
          onUpdateSuccess={handleSuccess}
          onCancel={() => setEditingService(null)}
        />
      )}
    </div>
  );
};

export default SecteurServiceManager;
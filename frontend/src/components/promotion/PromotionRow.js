// src/components/PromotionRow.js
import React from 'react';
import { Link } from 'react-router-dom';
import './PromotionRow.css';

const PromotionRow = ({ promotion }) => {
  return (
    <tr className="promotion-row">
      <td>{promotion.nomPromotion}</td>
      <td>{promotion.description}</td>
      <td>{promotion.reduction}%</td>
      <td>{new Date(promotion.dateDebut).toLocaleDateString()}</td>
      <td>{new Date(promotion.dateFin).toLocaleDateString()}</td>
      <td className="actions">
        <Link to={`/edit-promotion/${promotion._id}`} className="edit-btn">Edit</Link>
        <button className="delete-btn">Delete</button>
      </td>
    </tr>
  );
};

export default PromotionRow;

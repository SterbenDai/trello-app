import React, { useState } from 'react';

const Card = ({
  title,
  comments,
  isImportant,
  onRemove,
  onEdit,
  onAddComment,
  onToggleImportant,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [newComment, setNewComment] = useState('');

  const handleEdit = () => {
    onEdit(editedTitle);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div style={isImportant ? styles.importantCard : styles.card}>
      <div>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={styles.editInput}
            />
            <button onClick={handleEdit} style={styles.editButton}>
              <i className="fas fa-save"></i> Enregistrer
            </button>
          </>
        ) : (
          <>
            <p>{title}</p>
            <div>
              <label>
                <strong>Commentaires:</strong>
              </label>
              <ul>
                {comments && comments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
              <div style={styles.commentContainer}>
                <input
                  type="text"
                  placeholder="Nouveau commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment}>Ajouter</button>
              </div>
            </div>
            <div style={styles.dueDateContainer}>
              <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                <i className="fas fa-pencil-alt"></i> Modifier
              </button>
              <button onClick={onRemove} style={styles.removeButton}>
                <i className="fas fa-trash-alt"></i> Supprimer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    cursor: 'grab',
  },
  commentContainer: {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  dueDateContainer: {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  editInput: {
    marginRight: '8px',
  },
  editButton: {
    backgroundColor: '#5bc0de',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  toggleImportantButton: {
    backgroundColor: '#FFD700',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  removeButton: {
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Card;
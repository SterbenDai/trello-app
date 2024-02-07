import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';

const Board = () => {
  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem('trello-lists');
    return storedLists
      ? JSON.parse(storedLists)
      : [
          {
            title: 'Liste 1',
            cards: [
              { title: 'Card 1', completed: false },
              { title: 'Card 2', completed: true },
              { title: 'Card 3', completed: false },
            ],
          },
          {
            title: 'Liste 2',
            cards: [
              { title: 'Card 4', completed: true },
              { title: 'Card 5', completed: false },
            ],
          },
        ];
  });

  const [newCardTitle, setNewCardTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [confirmDeleteList, setConfirmDeleteList] = useState(null);

  const askForConfirmation = (listIndex) => {
    setConfirmDeleteList(listIndex);
  };

  const cancelDeleteList = () => {
    setConfirmDeleteList(null);
  };

  const confirmDeleteListHandler = () => {
    removeList(confirmDeleteList);
    setConfirmDeleteList(null);
  };

  useEffect(() => {
    localStorage.setItem('trello-lists', JSON.stringify(lists));
  }, [lists]);

  const onDragEnd = (result) => {
    try {
      if (!result.destination || result.type === 'list') return;

      const sourceListIndex = parseInt(result.source.droppableId, 10);
      const destinationListIndex = parseInt(result.destination.droppableId, 10);

      if (sourceListIndex === destinationListIndex) {
        const updatedLists = [...lists];
        const [movedCard] = updatedLists[sourceListIndex].cards.splice(result.source.index, 1);
        updatedLists[sourceListIndex].cards.splice(result.destination.index, 0, movedCard);
        setLists(updatedLists);
      } else {
        const updatedLists = [...lists];
        const [movedCard] = updatedLists[sourceListIndex].cards.splice(result.source.index, 1);
        updatedLists[destinationListIndex].cards.splice(result.destination.index, 0, movedCard);
        setLists(updatedLists);
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors du déplacement de la carte.');
    }
  };

  const addCard = (listIndex, newCardTitle) => {
    try {
      if (newCardTitle.trim() !== '') {
        const updatedLists = [...lists];
        updatedLists[listIndex].cards.push({ title: newCardTitle.trim(), completed: false });
        setLists(updatedLists);
        setNewCardTitle('');
        setNotification('Nouvelle carte ajoutée avec succès !');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors de l\'ajout de la carte.');
    }
  };

  const removeCard = (listIndex, cardIndex) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].cards.splice(cardIndex, 1);
    setLists(updatedLists);
  };

  const addList = () => {
    const newListTitle = prompt('Entrez le titre de la nouvelle liste:');
    if (newListTitle && newListTitle.trim() !== '') {
      const newList = { title: newListTitle.trim(), cards: [] };
      setLists([...lists, newList]);
      setNotification('Nouvelle liste ajoutée avec succès !');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const removeList = (listIndex) => {
    try {
      const updatedLists = [...lists];
      updatedLists.splice(listIndex, 1);
      setLists(updatedLists);
      setNotification('Liste supprimée avec succès !');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setError('Une erreur s\'est produite lors de la suppression de la liste.');
    }
  };

  const editCard = (listIndex, cardIndex, newTitle) => {
    const updatedLists = [...lists];
    updatedLists[listIndex].cards[cardIndex] = {
      title: newTitle,
      completed: false,
      comments: [],
      labels: [],
      dueDate: null,
      isImportant: false,
    };
    setLists(updatedLists);
  };

  const toggleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredCards = lists.flatMap((list) =>
    list.cards.filter((card) => {
      if (filter === 'completed') return card.completed;
      if (filter === 'uncompleted') return !card.completed;
      if (searchTerm.trim() === '') return true;
      return card.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.boardContainer} className="board-container">
        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button onClick={() => setError(null)}>Fermer</button>
          </div>
        )}
        {notification && (
          <div style={styles.notificationContainer}>
            <p style={styles.notificationText}>{notification}</p>
          </div>
        )}
        
        <Droppable droppableId="board" direction="horizontal">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={styles.listsContainer}>
              {lists.map((list, listIndex) => (
                <Draggable key={listIndex} draggableId={`list-${listIndex}`} index={listIndex}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={styles.listContainer}
                    >
                      <h2>{list.title}</h2>
                      <Droppable droppableId={`list-${listIndex}`} type="CARD">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} style={styles.list}>
                            {list.cards.map((card, cardIndex) => (
                              <Draggable
                                key={cardIndex}
                                draggableId={`card-${listIndex}-${cardIndex}`}
                                index={cardIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Card
                                      title={card.title}
                                      completed={card.completed}
                                      onRemove={() => removeCard(listIndex, cardIndex)}
                                      onEdit={(newTitle) => editCard(listIndex, cardIndex, newTitle)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <div style={styles.addCardContainer}>
                              <input
                                type="text"
                                placeholder="Nouvelle carte..."
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                              />
                              <button onClick={() => addCard(listIndex, newCardTitle)} disabled={!newCardTitle}>
                                Ajouter
                              </button>
                            </div>
                          </div>
                        )}
                      </Droppable>
                      <button onClick={() => askForConfirmation(listIndex)} style={styles.removeListButton}>
                        <i className="fas fa-trash-alt"></i> Supprimer la liste
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div style={styles.addListContainer}>
          <button onClick={addList} style={styles.addListButton}>
            Ajouter une liste
          </button>
        </div>
        
        {confirmDeleteList !== null && (
          <div style={styles.confirmationModal}>
            <p>Voulez-vous vraiment supprimer cette liste?</p>
            <div style={styles.confirmationButtons}>
              <button onClick={confirmDeleteListHandler} style={styles.confirmationButton}>
                Oui
              </button>
              <button onClick={cancelDeleteList} style={styles.confirmationButton}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

const styles = {
  boardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
  },
  errorContainer: {
    backgroundColor: '#ffcccc',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  errorText: {
    margin: '0',
  },
  notificationContainer: {
    backgroundColor: '#ccffcc',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  notificationText: {
    margin: '0',
  },
  listsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  },
  listContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
    padding: '10px',
    minWidth: '250px',
  },
  list: {
    minHeight: '100px',
  },
  addCardContainer: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  removeListButton: {
    marginTop: '10px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  addListButton: {
    backgroundColor: '#5bc0de',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  filterButton: {
    backgroundColor: '#f4f4f4',
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  activeFilterButton: {
    backgroundColor: '#5bc0de',
    color: '#fff',
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default Board;


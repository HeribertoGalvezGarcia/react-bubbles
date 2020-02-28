import React, { useState } from "react";
import axiosWithAuth from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "#000000" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const addNew = e => {
    e.preventDefault();
    axiosWithAuth().post("http://localhost:5000/api/colors", newColor)
      .then(({data}) => {
        updateColors(data);
        setNewColor(initialColor);
      })
      .catch(e => console.error(e));
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth().put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(({data: {id}}) => {
        setEditing(false);
        updateColors(colors => colors.map((color) => color.id === id ? colorToEdit : color));
      })
      .catch(e => console.error(e));
  };

  const deleteColor = ({id}) => {
    axiosWithAuth().delete(`http://localhost:5000/api/colors/${id}`)
      .then(() => {
        updateColors(colors => colors.filter(({id: oldId}) => id!==oldId));
        if (editing && colorToEdit.id===id) {
          setEditing(false);
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              type="color"
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button type="button" onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <form onSubmit={addNew}>
        <legend>Add color</legend>
        <label>
          color name:
          <input
            onChange={e =>
              setNewColor({ ...newColor, color: e.target.value })
            }
            value={newColor.color}
          />
        </label>
        <label>
          hex code:
          <input
            type="color"
            onChange={e =>
              setNewColor({
                ...newColor,
                code: { hex: e.target.value }
              })
            }
            value={newColor.code.hex}
          />
        </label>
        <div className="button-row">
          <button type="submit">save</button>
          <button type="button" onClick={() => setNewColor(initialColor)}>reset</button>
        </div>
      </form>
      <div className="spacer" />
    </div>
  );
};

export default ColorList;

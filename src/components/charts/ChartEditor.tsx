import React, { useState } from 'react';
import { X, Edit2, Plus, Trash2 } from 'lucide-react';
import { ChartData, ThemeColors } from './ChartTypes';
import { ChartDisplay } from './ChartDisplay';
import './ChartEditor.css';

interface ChartEditorProps {
  chartData: ChartData;
  onUpdate: (updatedChart: ChartData) => void;
  onDelete: () => void;
  themeColors: ThemeColors;
}

export const ChartEditor: React.FC<ChartEditorProps> = ({
  chartData,
  onUpdate,
  onDelete,
  themeColors
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chartData.title);
  const [data, setData] = useState(chartData.data);

  const handleSave = () => {
    onUpdate({
      ...chartData,
      title,
      data
    });
    setIsEditing(false);
  };

  const getColumns = () => {
    if (chartData.type === 'pie') {
      return ['name', 'value'];
    }
    const firstRow = data[0] || {};
    return Object.keys(firstRow);
  };

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [column]: column === 'name' ? value : Number(value) || 0
    };
    setData(newData);
  };

  const addRow = () => {
    const columns = getColumns();
    const newRow = columns.reduce((acc, col) => ({
      ...acc,
      [col]: col === 'name' ? 'New Row' : 0
    }), {});
    setData([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const renderEditingTable = () => {
    const columns = getColumns();

    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column} className="text-capitalize">
                  {column}
                </th>
              ))}
              <th className="text-center" style={{ width: '50px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(column => (
                  <td key={`${rowIndex}-${column}`}>
                    <input
                      type={column === 'name' ? 'text' : 'number'}
                      className="form-control form-control-sm"
                      value={row[column]}
                      onChange={(e) => handleCellChange(rowIndex, column, e.target.value)}
                    />
                  </td>
                ))}
                {/* <td className="text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteRow(rowIndex)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn btn-outline-primary btn-sm mb-3"
          onClick={addRow}
        >
          <Plus size={14} className="me-1" />
          Add Row
        </button>
      </div>
    );
  };

  return (
    <div className="chart-editor card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {isEditing ? (
            <input
              type="text"
              className="form-control w-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <h5 className="card-title mb-0">{title}</h5>
          )}
          <div className="btn-group">
            {/* <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 size={16} />
            </button> */}
            {/* <button
              className="btn btn-outline-danger btn-sm"
              onClick={onDelete}
            >
              <X size={16} />
            </button> */}
          </div>
        </div>

        {isEditing ? (
          <div className="mb-3">
            {renderEditingTable()}
            <div className="mt-2">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <ChartDisplay chartData={chartData} themeColors={themeColors} />
        )}
      </div>
    </div>
  );
};
import { Fragment, useState } from "react";
import { formatDateTime, formatDate, formatCurrency } from "../utils/format";



export default function OrderList({
  orders,
  showPartner = false,
  actionsForOrder,
  renderStatus,
}) {
  const [openId, setOpenId] = useState(null);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  const hasActions = typeof actionsForOrder === "function";
  const colCount = (showPartner ? 6 : 5) + (hasActions ? 1 : 0);

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            {showPartner && <th>Partner</th>}
            <th>Status</th>
            <th>Created</th>
            <th>Delivery</th>
            <th>Total (MKD)</th>
            {hasActions && <th style={{ width: 1 }} />}
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <FragmentRow
              key={o.id}
              order={o}
              isOpen={openId === o.id}
              onToggle={() => toggle(o.id)}
              showPartner={showPartner}
              hasActions={hasActions}
              actionsForOrder={actionsForOrder}
              renderStatus={renderStatus}
              colCount={colCount}
            />
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={colCount} className="muted">
                No orders.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function FragmentRow({
  order: o,
  isOpen,
  onToggle,
  showPartner,
  hasActions,
  actionsForOrder,
  renderStatus,
  colCount,
}) {
  return (
    <Fragment>
      <tr style={{ cursor: "pointer" }} onClick={onToggle} title="Click to view items">
        <td>{o.id}</td>
        {showPartner && <td>{o.partnerEmail}</td>}
        <td>{renderStatus ? renderStatus(o.status) : o.status}</td>
        <td>{formatDateTime(o.createdAt)}</td>
        <td>{o.deliveryDate ?? "-"}</td>
        <td>{formatCurrency(o.totalMkd)}</td>

        {hasActions && (
          <td
            onClick={(e) => e.stopPropagation()} // prevents row toggle when clicking button
            style={{ whiteSpace: "nowrap" }}
          >
            {actionsForOrder(o)}
          </td>
        )}
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={colCount}>
            <div className="card" style={{ marginTop: 8 }}>
              {o.notes && (
                <p className="muted" style={{ marginTop: 0 }}>
                  {o.notes}
                </p>
              )}

              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items?.map((it) => (
                      <tr key={it.id}>
                        <td>{it.productName}</td>
                        <td>{it.unit}</td>
                        <td>{it.quantity}</td>
                        <td>{it.priceMkdSnapshot}</td>
                        <td>{it.lineTotalMkd}</td>
                      </tr>
                    ))}

                    {(!o.items || o.items.length === 0) && (
                      <tr>
                        <td colSpan={5} className="muted">
                          No items.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

import { useState } from "react";
import { formatDateTime, formatDate, formatCurrency } from "../utils/format.js";

function StatusBadge({ status }) {
  const cls = `badge badge--${String(status ?? "").toLowerCase()}`;
  return <span className={cls}>{status ?? "-"}</span>;
}

export default function OrderList({
  orders = [],
  showPartner = false,
  actionsForOrder,          // (order) => JSX
  renderStatus,             // (status) => JSX
  renderItemAction,         // (order, item) => JSX
}) {
  const [openId, setOpenId] = useState(null);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  const hasActions = typeof actionsForOrder === "function";
  const hasItemAction = typeof renderItemAction === "function";

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 90 }}>ID</th>
            {showPartner && <th>Partner</th>}
            <th style={{ width: 160 }}>Status</th>
            <th style={{ width: 160 }}>Created</th>
            <th style={{ width: 150 }}>Delivery</th>
            <th style={{ width: 150 }}>Total</th>
            {hasActions && <th className="cell--actions">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => {
            const isOpen = openId === o.id;
            return (
              <OrderRow
                key={o.id}
                order={o}
                isOpen={isOpen}
                onToggle={() => toggle(o.id)}
                showPartner={showPartner}
                hasActions={hasActions}
                actionsForOrder={actionsForOrder}
                renderStatus={renderStatus}
                hasItemAction={hasItemAction}
                renderItemAction={renderItemAction}
              />
            );
          })}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={showPartner ? (hasActions ? 7 : 6) : (hasActions ? 6 : 5)}
                className="muted"
              >
                No orders.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({
  order,
  isOpen,
  onToggle,
  showPartner,
  hasActions,
  actionsForOrder,
  renderStatus,
  hasItemAction,
  renderItemAction,
}) {
  const o = order ?? {};
  const items = Array.isArray(o.items) ? o.items : [];

  return (
    <>
      <tr className="tableRowClickable" onClick={onToggle} title="Click to view items">
        <td className="cell--mono">{o.id}</td>
        {showPartner && <td>{o.partnerEmail ?? "-"}</td>}

        <td>
          {renderStatus ? renderStatus(o.status) : <StatusBadge status={o.status} />}
        </td>

        <td>{formatDateTime(o.createdAt)}</td>
        <td>{o.deliveryDate ? formatDate(o.deliveryDate) : "-"}</td>
        <td>{formatCurrency(o.totalMkd)}</td>

        {hasActions && (
          <td className="cell--actions" onClick={(e) => e.stopPropagation()}>
            {actionsForOrder(o)}
          </td>
        )}
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={showPartner ? (hasActions ? 7 : 6) : (hasActions ? 6 : 5)}>
            <div className="card card--flat" style={{ marginTop: 8 }}>
                {/* Admin notes */}
                {o.notes && (
                  <p className="muted" style={{ marginTop: 0 }}>
                    {o.notes}
                  </p>
                )}

                {/* Rejection reason */}
                {o.status === "REJECTED" && o.rejectionReason && (
                  <div className="error" style={{ marginTop: 8 }}>
                    <strong>Order rejected:</strong> {o.rejectionReason}
                  </div>
                )}
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style={{ width: 90 }}>Unit</th>
                      <th style={{ width: 120 }}>Qty</th>
                      <th style={{ width: 140 }}>Price</th>
                      <th style={{ width: 140 }}>Line</th>
                      {hasItemAction && <th className="cell--actions">Packed</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td>{it.productName ?? "-"}</td>
                        <td>{it.unit ?? "-"}</td>
                        <td className="cell--mono">{it.quantity ?? "-"}</td>
                        <td>{formatCurrency(it.priceMkdSnapshot)}</td>
                        <td>{formatCurrency(it.lineTotalMkd)}</td>
                        {hasItemAction && (
                          <td className="cell--actions">
                            {renderItemAction(o, it)}
                          </td>
                        )}
                      </tr>
                    ))}

                    {items.length === 0 && (
                      <tr>
                        <td colSpan={hasItemAction ? 6 : 5} className="muted">
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
    </>
  );
}

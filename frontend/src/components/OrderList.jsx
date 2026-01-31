import { useState } from "react";

export default function OrderList({ orders, showPartner = false }) {
  const [openId, setOpenId] = useState(null);

  function toggle(id) {
    setOpenId(prev => (prev === id ? null : id));
  }

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
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <FragmentRow
              key={o.id}
              order={o}
              isOpen={openId === o.id}
              onToggle={() => toggle(o.id)}
              showPartner={showPartner}
            />
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={showPartner ? 6 : 5} className="muted">No orders.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function FragmentRow({ order: o, isOpen, onToggle, showPartner }) {
  return (
    <>
      <tr style={{ cursor: "pointer" }} onClick={onToggle} title="Click to view items">
        <td>{o.id}</td>
        {showPartner && <td>{o.partnerEmail}</td>}
        <td>{o.status}</td>
        <td>{o.createdAt}</td>
        <td>{o.deliveryDate ?? "-"}</td>
        <td>{o.totalMkd}</td>
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={showPartner ? 6 : 5}>
            <div className="card" style={{ marginTop: 8 }}>
              {o.notes && <p className="muted" style={{ marginTop: 0 }}>{o.notes}</p>}

              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th><th>Unit</th><th>Qty</th><th>Price</th><th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items.map(it => (
                      <tr key={it.id}>
                        <td>{it.productName}</td>
                        <td>{it.unit}</td>
                        <td>{it.quantity}</td>
                        <td>{it.priceMkdSnapshot}</td>
                        <td>{it.lineTotalMkd}</td>
                      </tr>
                    ))}
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

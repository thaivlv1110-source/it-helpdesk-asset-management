import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axiosClient from "../api/axiosClient";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const AssetsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [assets, setAssets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [form, setForm] = useState({
    assetCode: "",
    name: "",
    categoryId: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiration: "",
    locationId: "",
    notes: "",
  });

  const isAdmin =
    user?.role === "ADMIN";

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await axiosClient.get(
          "/assets"
        );

      setAssets(
        response.data.data || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          t("assets.loadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return assets;
      }

      return assets.filter(
        (asset) => {
          const values = [
            asset.asset_code,
            asset.assetCode,
            asset.name,
            asset.brand,
            asset.model,
            asset.serial_number,
            asset.serialNumber,
            asset.status,
          ];

          return values.some(
            (value) =>
              String(value || "")
                .toLowerCase()
                .includes(keyword)
          );
        }
      );
    }, [assets, search]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      assetCode: "",
      name: "",
      categoryId: "",
      brand: "",
      model: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiration: "",
      locationId: "",
      notes: "",
    });
  };

  const openModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (!creating) {
      setShowModal(false);
    }
  };

  const handleCreateAsset =
    async (event) => {
      event.preventDefault();

      try {
        setCreating(true);
        setError("");
        setSuccess("");

        const payload = {
          assetCode:
            form.assetCode.trim(),

          name:
            form.name.trim(),

          categoryId:
            Number(
              form.categoryId
            ),

          brand:
            form.brand.trim() ||
            null,

          model:
            form.model.trim() ||
            null,

          serialNumber:
            form.serialNumber.trim() ||
            null,

          purchaseDate:
            form.purchaseDate ||
            null,

          warrantyExpiration:
            form.warrantyExpiration ||
            null,

          locationId:
            form.locationId
              ? Number(
                  form.locationId
                )
              : null,

          notes:
            form.notes.trim() ||
            null,
        };

        await axiosClient.post(
          "/assets",
          payload
        );

        setShowModal(false);

        setSuccess(
          t(
            "assets.createSuccess"
          )
        );

        resetForm();

        await loadAssets();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            t(
              "assets.createError"
            )
        );
      } finally {
        setCreating(false);
      }
    };

  return (
    <div>
      <div className="page-heading admin-page-heading">
        <div>
          <h1>
            {t("assets.title")}
          </h1>

          <p>
            {t(
              "assets.description"
            )}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="button-primary"
            onClick={
              openModal
            }
          >
            + {t(
              "assets.addAsset"
            )}
          </button>
        )}
      </div>

      {success && (
        <div className="page-success">
          {success}
        </div>
      )}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      <section className="content-panel">
        <div className="table-toolbar">
          <div className="table-search">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={t(
                "assets.searchPlaceholder"
              )}
            />
          </div>

          <span className="table-count">
            {filteredAssets.length}{" "}
            {t(
              "assets.assetsCount"
            )}
          </span>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>
              {t("common.loading")}
            </p>
          </div>
        ) : filteredAssets.length ===
          0 ? (
          <div className="empty-state">
            <strong>
              {t(
                "assets.noAssets"
              )}
            </strong>

            <p>
              {t(
                "assets.noAssetsDescription"
              )}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    {t(
                      "assets.assetCode"
                    )}
                  </th>

                  <th>
                    {t(
                      "assets.assetName"
                    )}
                  </th>

                  <th>
                    {t(
                      "assets.brand"
                    )}
                  </th>

                  <th>
                    {t(
                      "assets.model"
                    )}
                  </th>

                  <th>
                    {t(
                      "assets.serialNumber"
                    )}
                  </th>

                  <th>
                    {t(
                      "assets.status"
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAssets.map(
                  (asset) => (
                    <tr key={asset.id}>
                      <td>
                        <span className="asset-code">
                          {asset.asset_code ||
                            asset.assetCode ||
                            "-"}
                        </span>
                      </td>

                      <td>
                        <div className="table-primary">
                          {asset.name}
                        </div>
                      </td>

                      <td>
                        {asset.brand ||
                          "-"}
                      </td>

                      <td>
                        {asset.model ||
                          "-"}
                      </td>

                      <td>
                        {asset.serial_number ||
                          asset.serialNumber ||
                          "-"}
                      </td>

                      <td>
                        <AssetStatus
                          status={
                            asset.status
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && isAdmin && (
        <div
          className="modal-backdrop"
          onMouseDown={
            closeModal
          }
        >
          <div
            className="modal-card modal-card-large"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {t(
                    "assets.createTitle"
                  )}
                </h2>

                <p>
                  {t(
                    "assets.createDescription"
                  )}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeModal
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleCreateAsset
              }
            >
              <div className="modal-body">
                <div className="form-grid-2">

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.assetCode"
                      )}
                    </label>

                    <input
                      name="assetCode"
                      value={
                        form.assetCode
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="LAP-003"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.assetName"
                      )}
                    </label>

                    <input
                      name="name"
                      value={
                        form.name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Dell Latitude 5450"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.categoryId"
                      )}
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="categoryId"
                      value={
                        form.categoryId
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.locationId"
                      )}
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="locationId"
                      value={
                        form.locationId
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.brand"
                      )}
                    </label>

                    <input
                      name="brand"
                      value={
                        form.brand
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.model"
                      )}
                    </label>

                    <input
                      name="model"
                      value={
                        form.model
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.serialNumber"
                      )}
                    </label>

                    <input
                      name="serialNumber"
                      value={
                        form.serialNumber
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.purchaseDate"
                      )}
                    </label>

                    <input
                      type="date"
                      name="purchaseDate"
                      value={
                        form.purchaseDate
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "assets.warrantyExpiration"
                      )}
                    </label>

                    <input
                      type="date"
                      name="warrantyExpiration"
                      value={
                        form.warrantyExpiration
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                </div>

                <div className="form-field">
                  <label>
                    {t(
                      "assets.notes"
                    )}
                  </label>

                  <textarea
                    name="notes"
                    value={
                      form.notes
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={
                    closeModal
                  }
                  disabled={
                    creating
                  }
                >
                  {t(
                    "common.cancel"
                  )}
                </button>

                <button
                  type="submit"
                  className="button-primary"
                  disabled={
                    creating
                  }
                >
                  {creating
                    ? t(
                        "assets.creating"
                      )
                    : t(
                        "assets.createAsset"
                      )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AssetStatus = ({
  status,
}) => {
  const className =
    String(status || "")
      .toLowerCase()
      .replaceAll("_", "-");

  return (
    <span
      className={`status-pill asset-status-${className}`}
    >
      {status?.replaceAll(
        "_",
        " "
      ) || "-"}
    </span>
  );
};

export default AssetsPage;
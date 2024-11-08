function generateAccordion(filesData, descriptionsData) {
  const $accordion = $("#fileAccordion");
  let index = 0;

  $.each(filesData, function (directory, files) {
    index++;
    const description = descriptionsData[directory]
      ? `(${descriptionsData[directory].description})`
      : "";
    const classes = descriptionsData[directory]?.class || [];

    // 如果 `classes` 不存在或為空，則只生成主層顯示
    if (classes.length === 0) {
      const mainAccordionHtml = generateMainAccordion(
        directory,
        files,
        description,
        index
      );
      $accordion.append(mainAccordionHtml);
    } else {
      // 如果 `classes` 存在，生成子項目並根據 `classes` 過濾資料
      let classifiedFiles = {};
      console.log(classes);
      Object.keys(classes).forEach((cls) => {
        classifiedFiles[cls] = [];

        classifiedFiles[cls] = files.filter((file) => {
          if (!file.trim()) {
            return false; // 忽略空的 file
          }

          const [, , , , name] = file.trim().split(/\s+/);
          return name.startsWith(cls); // 檢查檔案名稱是否以 class 開頭
        });
      });

      console.log(classifiedFiles);

      // 先生成子項目，再生成主層顯示
      const classAccordionHtml = generateClassAccordion(
        directory,
        files,
        classes,
        description,
        index
      );
      $accordion.append(classAccordionHtml);
    }
  });
}

function generateMainAccordion(
  directory,
  unclassifiedFiles,
  description,
  index
) {
  const headerId = `heading${index}`;
  const collapseId = `collapse${index}`;

  return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                    ${directory} <span class="ms-2 text-muted">${description}</span>
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#fileAccordion">
                <div class="accordion-body">
                    ${
                      unclassifiedFiles.length > 0
                        ? `<table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>檔案名稱</th>
                                    <th>更新時間</th>
                                    <th>大小</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${unclassifiedFiles
                                  .map((file) => {
                                    const [size, month, day, time, name] = file
                                      .trim()
                                      .split(/\s+/);
                                    return `
                                        <tr>
                                            <td>${name}</td>
                                            <td>${month} ${day} ${time}</td>
                                            <td>${size}</td>
                                        </tr>
                                    `;
                                  })
                                  .join("")}
                            </tbody>
                        </table>`
                        : `<p>No unclassified files available.</p>`
                    }
                </div>
            </div>
        </div>
      `;
}

function generateClassAccordion(directory, files, classes, description, index) {
  const classAccordionId = `classAccordion${index}`;
  const headerId = `heading${index}`;
  const collapseId = `collapse${index}`;
  return `

          <div class="accordion-item">
            <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                    ${directory} <span class="ms-2 text-muted">${description}</span>
                </button>
            </h2>


            <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#fileAccordion">
                ${Object.entries(classes)
                  .map(([key, value]) => {
                    const classHeaderId = `classHeading${index}_${index}`;
                    const classCollapseId = `classCollapse${index}_${index}`;

                    return `
                    <div class="accordion-item">
                        <h2 class="accordion-header mx-2" id="${classHeaderId}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${classCollapseId}" aria-expanded="false" aria-controls="${classCollapseId}">
                            ${key} ${value}
                            </button>
                        </h2>
                        <div id="${classCollapseId}" class="accordion-collapse collapse" aria-labelledby="${classHeaderId}" data-bs-parent="#${classAccordionId}">
                            <div class="accordion-body">
                                ${
                                  files.length > 0
                                    ? `<table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>檔案名稱</th>
                                                <th>更新時間</th>
                                                <th>大小</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${files
                                              .map((file) => {
                                                const [
                                                  size,
                                                  month,
                                                  day,
                                                  time,
                                                  name,
                                                ] = file.trim().split(/\s+/);
                                                return `
                                                    <tr>
                                                        <td>${name}</td>
                                                        <td>${month} ${day} ${time}</td>
                                                        <td>${size}</td>
                                                    </tr>
                                                `;
                                              })
                                              .join("")}
                                        </tbody>
                                    </table>`
                                    : `No files matching ${cls} found.`
                                }
                            </div>
                        </div>
                    </div>
                  `;
                  })
                  .join("")}
            </div>
          </div>
      `;
}
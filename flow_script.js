const maxTags = 200;
let tags = [];
const maxlength = 20;
$(document).ready(function () {
  fetchTags();
});

$(document).ready(function () {
  $(".default-tag").on("click", function () {
    if ($(this).is(":checked")) {
      fetchAddTag($(this).val());
    } else {
      fetchDeleteTag($(this).val());
    }
  });
});
// 서버에서 태그 가져오기
function fetchTags() {
  $.ajax({
    url: "http://3.34.230.82:8080/extension-list",
    type: "GET",
    contentType: "application/json",
    success: function (data) {
      tags = data.map((tag) => tag.extensionName);
      initTags(data);
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}

function initTags(tags) {
  const tagsContainer = $("#tags-container");
  const defaultTags = getDefaultValues();
  const existingTags = tags.map((tag) => tag.extensionName);

  existingTags.map((element) => {
    if (defaultTags.includes(element)) {
      $.map($(".default-tag"), function (value) {
        if ($(value).val() === element) {
          value.checked = true;
          return;
        }
      });
    } else {
      const newTag = $('<div class="tag"></div>')
        .text(element)
        .append('<span class="remove-tag" onclick="removeTag(this)">x</span>');
      tagsContainer.append(newTag);
    }
  });

  updateTagCount();
}

function getDefaultValues() {
  return $.map($(".default-tag"), function (value) {
    return $(value).val();
  });
}
function fetchAddTag(tagValue) {
  $.ajax({
    url: "http://3.34.230.82:8080/extension-update",
    type: "POST",
    data: {extensionName : tagValue},
    contentType: "application/json",
    success: function (data) {
      tags.push(tagValue);
      renderTags();
    },
    error: function (error) {
      alert(tagValue + "가 이미 존재 합니다");
      console.error("Error:", error);
    },
  });
}

function addTag() {
  const input = document.getElementById("tag-input");
  const tagValue = input.value.trim();

  if (
    tagValue &&
    !tags.includes(tagValue) &&
    tags.length < maxTags &&
    tagValue.length <= maxlength
  ) {
    fetchAddTag(tagValue);
  } else {
    if(tags.includes(tagValue)){
      alert("확장자가 이미 존재합니다")
      return;
    }
    if(tags.length >= maxTags){
      alert("확장자는 최대 200개 까지 추가 가능합니다")
      return;
    }
    if(tagValue.length >= maxlength){
      alert("확장자의 길이는 최대 20자 입니다")
      return;
    }
  }
  input.value = "";
}

function fetchDeleteTag(tagValue) {
  $.ajax({
    url: "http://3.34.230.82:8080/extension-delete/" + tagValue,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      tags = tags.filter((element) => element !== tagValue);

      renderTags();
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}

function removeTag(element) {
  const tagValue = $(element).parent().text().trim().slice(0, -1);
  fetchDeleteTag(tagValue);
}

function updateTagCount() {
  const tags = $("#tags-container .tag").length;
  $("#tag-count").text(tags);
}

function renderTags() {
  const tagsContainer = $("#tags-container");
  const defaultTags = getDefaultValues();
  tagsContainer.empty();

  $.each(tags, function (index, element) {
    if (defaultTags.includes(element)) {
      $(".default-tag").each(function () {
        if ($(this).val() === element) {
          $(this).prop("checked", true);
          return false;
        }
      });
    } else {
      const newTag = $('<div class="tag"></div>')
        .text(element)
        .append(
          $('<span class="remove-tag"></span>')
            .text("x")
            .on("click", function () {
              removeTag(this);
            })
        );
      tagsContainer.append(newTag);
    }
  });

  updateTagCount();
}

// New code added to display timestamp
var last_message_time = null;

function addMessage(content, role) {
    var message_class = role === "user" ? "user-message" : "assistant-message";
  
    var timestamp_html = "";
    var now = new Date();
    if (last_message_time == null || (now.getTime() - last_message_time.getTime()) > (60000 * 59)) {
      var timestamp = now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
      timestamp_html = `
        <div class="timestamp">${timestamp}</div>
      `;
      last_message_time = now;
    }
  
    var content_html = content.replace(/\n/g, "<br>");
    var message_html = `
      <div class="message ${message_class}">
        <div class="message-content-wrapper">
          ${timestamp_html}
          <div class="message-content">${content_html}</div>
        </div>
      </div>
    `;
    $("#messages").append(message_html);
  
    // Scroll to the bottom of the messages container
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
}
$("#send-button").on("click", function () {
    var user_input = $("#user-input").val().trim();

    if (user_input.length === 0) {
        return;
    }

    addMessage(user_input, "user");
    $("#user-input").val("");
    $.post("/send_message", { user_input: user_input })
        .done(function (data) {
            var assistant_response = data.assistant_response;
            addMessage(assistant_response, "assistant");
        })
        .fail(function (xhr, textStatus, errorThrown) {
            console.error("Error: " + textStatus + " | " + errorThrown);
            console.error(xhr.responseText);
        });
});

$("#user-input").on("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        $("#send-button").trigger("click");
    }
});

// Changes to be made:
// 
// 3. the messages received should not overflow the container.
// 4. all user posted messages and received messages should stay within the confines of the container. 
// If an individual message reaches an extensive length that's equal to 4/5ths of vh of the screen, 
// they should be truncated with a `....` at the end. 
// Then, if the user clicks or taps on the message, 
// it should expand in floating element above the rest of the content until the user clicks or taps outside of the message.
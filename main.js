window.onload = function() {

  /**************************************************
   * Global Variables                               *
   **************************************************/

  var width = $(document).width(),
    height = $(document).height(),
    canvasMaxWidth = (width - 30) / 2,
    canvasMaxHeight = height - 20;

  var debugEnabled = true;

  var svg,
    rectGroup,
    circleGroup;

  var options = {
    backgroundColor: '#888',
    rectColor: '#000',
    circleColor: '#fff',
    rectWidth: 40,
    rectHeight: 40,
    spaceWidth: 10,
    spaceHeight: 10
  };

  function printLog(msg) {
    if (debugEnabled) {
      console.log(msg);
    }
  }

  /**************************************************
   * Draw Area                                      *
   **************************************************/

  function init() {
    $('#optionsData').val(JSON.stringify(options, null, 2));

    svg = d3.select('#gridCanvas').append('svg').attr('width', canvasMaxWidth).attr('height', canvasMaxHeight);
    rectGroup = svg.append('g').attr('id', 'rectGroup');
    circleGroup = svg.append('g').attr('id', 'circleGroup');

    draw();
  }

  function reset() {
    rectGroup.remove();
    circleGroup.remove();
    rectGroup = svg.append('g').attr('id', 'rectGroup');
    circleGroup = svg.append('g').attr('id', 'circleGroup');
  }

  function draw() {

    var posX = 0,
      posY = 0,
      canvasXMax,
      canvasYMax;

    // First draw rects
    while (nextColumn(posX)) {
      while (nextRow(posY)) {
        drawRectangle({
          group: rectGroup,
          x: posX,
          y: posY,
          width: options.rectWidth,
          height: options.rectHeight,
          color: options.rectColor
        });
        posY = calculateNextY(posY);
      }
      canvasYMax = posY - options.spaceHeight;
      posY = 0;
      posX = calculateNextX(posX);
    }
    canvasXMax = posX - options.spaceWidth;

    // Then draw circles
    posX = options.rectWidth + (options.spaceWidth / 2);
    posY = options.rectHeight + (options.spaceHeight / 2);
    while (nextColumn(posX)) {
      while (nextRow(posY)) {
        drawCircle({
          group: circleGroup,
          x: posX,
          y: posY,
          r: options.spaceHeight / 2 + (options.spaceHeight / 5),
          color: options.circleColor
        });
        posY = calculateNextY(posY);
      }
      posY = options.rectHeight + (options.spaceHeight / 2);
      posX = calculateNextX(posX);
    }

    // Resize canvas
    svg.attr("width", canvasXMax).attr("height", canvasYMax);
    $("#gridCanvas").css({
      "width": canvasXMax,
      "height": canvasYMax,
      "background-color": options.backgroundColor
    });
  }

  function calculateNextX(posX) {
    return posX + options.rectWidth + options.spaceWidth;
  }

  function calculateNextY(posY) {
    return posY + options.rectHeight + options.spaceHeight;
  }

  function nextColumn(posX) {
    return calculateNextX(posX) <= canvasMaxWidth;
  }

  function nextRow(posY) {
    return calculateNextY(posY) <= canvasMaxHeight;
  }

  function drawCircle(obj) {
    return obj.group.append('circle')
      .attr('cx', obj.x)
      .attr('cy', obj.y)
      .attr('r', obj.r)
      .attr('fill', obj.color);
  }

  function drawRectangle(obj) {
    return obj.group.append('rect')
      .attr('x', obj.x)
      .attr('y', obj.y)
      .attr('width', obj.width)
      .attr('height', obj.height)
      .attr('fill', obj.color);
  }

  /**************************************************
   * UI Bindings                                    *
   **************************************************/

  // Init tooltip
  $(function() {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $('#draw').click(function() {
    options = JSON.parse($('#optionsData').val()) || {};
    reset();
    draw();
  });

  // Draw immediately grid with default values.
  init();

}

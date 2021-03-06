import React, { Component } from 'react';
import styled from 'styled-components';
import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    DiscreteColorLegend,
    Highlight,
    Borders,
} from 'react-vis';
import { connect } from 'react-redux';
import { colors } from '../../style/colors';

class Graph extends Component {
    state = {
        lastDrawLocation: null,
    };

    render() {
        let years = [];
        if (this.props.yearsOfWork) {
            for (let i = 0; i <= this.props.yearsOfWork + 1; i += 2) {
                years.push(i);
            }
        } else {
            for (let i = 0; i <= 40; i += 2) {
                years.push(i);
            }
        }

        const { lastDrawLocation } = this.state;

        return (
            <GraphContainer>
                <FlexibleWidthXYPlot
                    height={600}
                    margin={{ left: 75 }}
                    xDomain={
                        lastDrawLocation && [
                            lastDrawLocation.left,
                            lastDrawLocation.right,
                        ]
                    }
                    yDomain={
                        lastDrawLocation && [
                            lastDrawLocation.bottom,
                            lastDrawLocation.top,
                        ]
                    }
                    style={{ background: 'white' }}
                >
                    <HorizontalGridLines style={{ stroke: colors.gridColor }} />
                    <VerticalGridLines
                        style={{ stroke: colors.gridColor }}
                        tickValues={years}
                    />

                    <LineSeries
                        className="preLambda"
                        animation="gentle"
                        data={
                            this.props.cumulativeBefore.length > 0
                                ? this.props.cumulativeBefore
                                : [{ x: 0, y: 5000 }, { x: 40, y: 5000 }]
                        }
                        style={{
                            strokeLineJoin: 'round',
                            strokeWidth: this.props.yearsOfWork ? 2 : 7,
                            stroke: 'rgb(255,6,65)',
                        }}
                        opacity={this.props.yearsOfWork ? 1 : 0.2}
                    />
                    <LineSeries
                        className="postLambda"
                        animation="gentle"
                        data={
                            this.props.cumulativeAfter.length > 0
                                ? this.props.cumulativeAfter
                                : [{ x: 0, y: 5000 }, { x: 0, y: 10000 }]
                        }
                        style={{
                            strokeLineJoin: 'round',
                            strokeWidth: this.props.yearsOfWork ? 2 : 7,
                            stroke: 'rgb(41,160,221)',
                        }}
                        opacity={this.props.yearsOfWork ? 1 : 0.2}
                    />

                    <Borders style={{ all: { fill: colors.bodyBg } }} />
                    <XAxis
                        title="YRS"
                        style={{
                            title: {
                                fontSize: 14,
                                fill: 'lightgrey',
                            },
                            text: {
                                stroke: 'black',
                                fontWeight: 100,
                                fontSize: 12,
                            },
                        }}
                        tickValues={years}
                    />
                    <YAxis
                        title="Total Earnings"
                        style={{
                            title: {
                                fontSize: 14,
                                fill: 'lightgrey',
                            },
                            text: {
                                stroke: 'black',
                                fontWeight: 100,
                                fontSize: 12,
                            },
                        }}
                    />

                    <Highlight
                        onBrushEnd={area =>
                            this.setState({ lastDrawLocation: area })
                        }
                        onDrag={area => {
                            this.setState({
                                lastDrawLocation: {
                                    bottom:
                                        lastDrawLocation.bottom +
                                        (area.top - area.bottom),
                                    left:
                                        lastDrawLocation.left -
                                        (area.right - area.left),
                                    right:
                                        lastDrawLocation.right -
                                        (area.right - area.left),
                                    top:
                                        lastDrawLocation.top +
                                        (area.top - area.bottom),
                                },
                            });
                        }}
                    />
                </FlexibleWidthXYPlot>
            </GraphContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        cumulativeBefore: state.cumulativeBefore,
        cumulativeAfter: state.cumulativeAfter,
        yearsOfWork: state.yearsOfWork,
    };
};

//CSS ------------------------------------------------------------------------------------------------------------------------------------------------------------------

const GraphContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 60rem;
    width: 50%;
    margin-left: -2rem;
    padding-right: 1.5rem;

    @media (max-width: 1024px) {
        width: 100%;
        padding: 4rem 4rem 4rem 2rem;
    }
`;

export default connect(mapStateToProps)(Graph);

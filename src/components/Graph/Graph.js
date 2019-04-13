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

        const legendItems = [
            {
                title: 'Pre-Lambda',
                color: 'rgb(255,6,65)',
                strokeWidth: 6,
            },
            {
                title: 'Post-Lambda',
                color: 'rgb(41,160,221)',
                strokeWidth: 6,
            },
        ];

        const { lastDrawLocation } = this.state;

        return (
            <GraphContainer>
                <FlexibleWidthXYPlot
                    height={600}
                    margin={{ left: 95 }}
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
                >
                    <HorizontalGridLines
                        style={{ stroke: 'hsl(42, 15%, 90%)' }}
                    />
                    <VerticalGridLines
                        style={{ stroke: 'hsl(42, 15%, 90%)' }}
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
                        style={{ fontSize: 14 }}
                        tickValues={years}
                    />
                    <YAxis
                        title="Total Earnings ($)"
                        style={{ fontSize: 14 }}
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
                <DiscreteColorLegend
                    items={legendItems}
                    orientation="horizontal"
                    style={{
                        fontSize: 14,
                        overflowY: 'hidden',
                        paddingLeft: 20,
                    }}
                />
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
    width: 55%;
    padding-right: 1.5rem;

    @media (max-width: 1024px) {
        width: 100%;
        padding: 4rem 4rem 4rem 2rem;
    }

    @media (max-width: 65rem) {
        padding: 4rem 0;
    }
`;

export default connect(mapStateToProps)(Graph);
